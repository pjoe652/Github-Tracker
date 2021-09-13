import { useEffect, useState } from "react";
import Particles from "react-particles-js";
import { useHistory, useLocation, useParams } from "react-router";
import { particleParams, particleStyle } from "../constants/particle";
import Navbar from "./Navbar";
import UserDetails from "./UserDetails";
import UserSearch from "./UserSearch";

function Userpage() {
  const [searchUser, setSearchUser] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [sortedSuggestions, setSortedSuggestions] = useState([])
  const [incompleteSearch, toggleIncompleteSearch] = useState(false)
  const [sortType, setSortType] = useState("created_at")
  const [activeUserDetail, setActiveUserDetail] = useState(null)
  const [redirected, toggleRedirected] = useState(false)
  const [displayScrollUp, toggleDisplayScrollUp] = useState(false)
  const [errored, toggleErrored] = useState(false)

  const { id } = useParams()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    if (id) {
      setSearchUser(id)
      setActiveUserDetail(
        fetch(`https://api.github.com/users/${id}`, {
          mode: "cors",
          headers: {
            Authorization: process.env.REACT_APP_GITHUB_API_KEY
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res.login) {
            setActiveUserDetail(res)
          } else {
            displayError()
          }
        })
      )
    }

    if (location.pathname === "/users") {
      if (location.state) {
        setSearchUser(location.state.searchUser)
        setSuggestions(location.state.suggestions)
        toggleIncompleteSearch(location.state.incompleteSearch)
        toggleRedirected(true)
      }
    }

    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight) {
        toggleDisplayScrollUp(true)
      } else {
        toggleDisplayScrollUp(false)
      }
    })
  }, [])

  useEffect(() => {
    if (searchUser && searchUser.length > 5 && !incompleteSearch) {
      fetch(`https://api.github.com/search/users?q=${searchUser}&per_page=10`, {
        mode: "cors",
        headers: {
          Authorization: process.env.REACT_APP_GITHUB_API_KEY
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.items) {
            const searchedUserLogins = []

            // Add names to existing names
            res.items.forEach(user => {
              searchedUserLogins.push(user.login)
            })

            // Update current users
            setSuggestions(searchedUserLogins)

            // Only 10 users are returned
            if (res.total_count > 10) {
              toggleIncompleteSearch(false)
            } else {
              toggleIncompleteSearch(true)
            }
          } else {
            displayError()
          }
        })
    } else if (searchUser && searchUser.length <= 5) {
      setSuggestions([])
      toggleIncompleteSearch(false)
    }
  }, [searchUser, incompleteSearch])

  const sortSuggestions = (detailedSuggestions) => {
    const sortedDetailedSuggestions = detailedSuggestions.sort((a, b) => {
      return b[sortType] - a[sortType]
    })
    setSortedSuggestions(sortedDetailedSuggestions)
  }

  useEffect(() => {
    sortSuggestions(sortedSuggestions)
  }, [sortType])

  useEffect(() => {
    if (redirected && suggestions.length > 0) {
      getDetailedUserList()
      toggleRedirected(false)
    }
  })

  const displayError = () => {
    toggleErrored(true)
    setTimeout(() => { toggleErrored(false) }, 1000)
  }

  const fetchDetailedUser = (list) => {
    return Promise.all(list.map(user => {
      return fetch(`https://api.github.com/users/${user}`, {
        mode: "cors",
        headers: {
          Authorization: process.env.REACT_APP_GITHUB_API_KEY
        }
      })
      .then(res => res.json())
      .then((res) => {
        if (res.login) {
          res.created_at = Date.parse(res.created_at)
          return res;
        } else {
          displayError()
        }
      })
    }))
  }

  const submitUserSearch = (e) => {
    e.preventDefault()

    if (location.pathname !== "/users") {
      history.push({pathname: "/users", state: {
        suggestions: suggestions,
        searchUser: searchUser,
        incompleteSearch: incompleteSearch,
      }})
    }

    getDetailedUserList()
  }

  const getDetailedUserList = () => {
    // Get detailed list of new users
    fetchDetailedUser(suggestions).then(detailedRes => {
      sortSuggestions(detailedRes)
    })
  }

  const selectSuggestion = (user) => {
    fetchDetailedUser(suggestions).then(detailedRes => {
      sortSuggestions(detailedRes)
      setSearchUser(user)
    })
  }

  const selectUser = (user) => {
    history.push(`users/${user}`)
  }

  return (
    <div className="userpage-container">
      <Particles height="100vh" width="100vw" style={particleStyle} params={particleParams}/>
      <Navbar setSearchUser={setSearchUser} suggestions={suggestions} searchUser={searchUser} submitUserSearch={submitUserSearch} selectSuggestion={selectSuggestion}/>
      {
        errored ? <div className="error-message">There has been an error with your request</div> : null
      }
      {
        activeUserDetail 
        ? <UserDetails activeUserDetail={activeUserDetail} />
        : <UserSearch sortType={sortType} setSortType={setSortType} sortedSuggestions={sortedSuggestions} selectUser={selectUser} />
      }
      {
        displayScrollUp ? <i class="fas fa-arrow-up" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}/> : null
      }  
    </div>
  );
}

export default Userpage;
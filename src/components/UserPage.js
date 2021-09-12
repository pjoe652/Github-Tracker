import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Navbar from "./Navbar";
import UserDetails from "./UserDetails";
import UserSearch from "./UserSearch"

function Userpage() {
  const [searchUser, setSearchUser] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [sortedSuggestions, setSortedSuggestions] = useState([])
  const [incompleteSearch, toggleIncompleteSearch] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [sortType, setSortType] = useState("created_at")
  const [activeUserDetail, setActiveUserDetail] = useState(null)

  const { id } = useParams()
  const history = useHistory()

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
          }
        })
      )
    }
  }, [])

  useEffect(() => {
    if (searchUser.length > 5 && !incompleteSearch) {
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

            // Filter out existing users to update search
            res.items = res.items.filter(user => {
              searchedUserLogins.push(user.login)
              return !availableUsers.includes(user.login)
            })

            // Update current users
            setSuggestions(searchedUserLogins)

            // Only 10 users are returned
            if (res.total_count > 10) {
              toggleIncompleteSearch(false)
            } else {
              toggleIncompleteSearch(true)
            }
          }
          // else errored
        })
    } else if (searchUser.length <= 5) {
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
        }
      })
    }))
  }

  const submitUserSearch = (e) => {
    e.preventDefault()

    // Get detailed list of new users
    fetchDetailedUser(suggestions).then(detailedRes => {
      sortSuggestions(detailedRes)
    })
  }

  const selectSuggestion = (user) => {
    setSearchUser(user)
  }

  const selectUser = (user) => {
    history.push(`users/${user}`)
  }

  return (
    <div>
      <div className="userpage-container">
        <Navbar setSearchUser={setSearchUser} suggestions={suggestions} searchUser={searchUser} submitUserSearch={submitUserSearch} />
        {
          activeUserDetail 
          ? <UserDetails activeUserDetail={activeUserDetail}/>
          : <UserSearch sortType={sortType} setSortType={setSortType} sortedSuggestions={sortedSuggestions} selectUser={selectUser} />
        }

      </div>
    </div>
    
  );
}

export default Userpage;
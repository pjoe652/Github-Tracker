import { useEffect, useState } from "react";

function Homepage() {
  const [searchUser, setSearchUser] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [sortedSuggestions, setSortedSuggestions] = useState([])
  const [incompleteSearch, toggleIncompleteSearch] = useState(false)
  const [displaySuggestions, toggleDisplaySuggestions] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [sortType, setSortType] = useState("created_at")

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
    setSuggestions([])
  }

  const updateSortType = (e) => {
    setSortType(e.target.value)
    sortSuggestions(sortedSuggestions)
  }

  return (
    <div className="homepage-container">
      <div className="homepage-navbar">
        <span className="homepage-header">Github User Search</span>
        <form className="homepage-form" onSubmit={(e) => submitUserSearch(e)}>
          <div className="input-dropdown-suggestions">
            <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} onFocus={() => toggleDisplaySuggestions(true)} onBlur={() => toggleDisplaySuggestions(false)}/>
            <ul className={suggestions.length > 0 ? "available" : "no-suggestions"}>
              {
                suggestions.filter(user => user.includes(searchUser) && displaySuggestions).slice(0, 10).map((user, i) => 
                  <li style={{"--delay":`${(i + 1) * 0.1 + 0.3}s`}} onClick={() => selectSuggestion(user)}>{user}</li>
                )
              }
            </ul>
          </div>
          <button type="submit"><i class="fas fa-search" /></button>
        </form>
      </div>
      <div className="homepage-user-content-container">
        <select className="sort-select" onChange={(e) => setSortType(e.target.value)}>
          <option value="created_at">Created At</option>
          <option value="followers">Followers</option>
          <option value="public_repos">Public Repos</option>
        </select>
        <div className="suggested-users-container">
          {
            sortedSuggestions.map(user => 
              <div className="suggested-user-wrapper">
                <span>{user.login}</span>
                <span>{sortType === "created_at" ? new Date(user[sortType]).toLocaleDateString("en-US") : user[sortType]}</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Homepage;

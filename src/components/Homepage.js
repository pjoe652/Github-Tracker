import { useEffect, useState } from "react";

function Homepage() {
  const [searchUser, setSearchUser] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [incompleteSearch, toggleIncompleteSearch] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null)

  useEffect(() => {
    if (searchUser.length > 5 && !incompleteSearch) {
      console.log("Suggestions")
      fetch(`https://api.github.com/search/users?q=${searchUser}`)
        .then(res => res.json())
        .then((res) => {
          if (res.items) {
            setSuggestions(res.items)
            toggleIncompleteSearch(res.incomplete_results)
          }
          // Errored
        })
    } else if (searchUser.length <= 5) {
      setSuggestions([])
    }
  }, [searchUser])

  const submitUserSearch = (e) => {
    e.preventDefault()
  }

  const selectSuggestion = (user) => {
    // Change routes to that user's page
    setSearchUser(user)
    setSuggestions([])
  }

  return (
    <div className="homepage-container">
      <span className="homepage-header">Github User Search</span>
      <form className="homepage-form" onSubmit={(e) => submitUserSearch(e)}>
        <div className="input-dropdown-suggestions">
          <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)}/>
          <ul className={suggestions.length > 0 ? "available" : "no-suggestions"}>
            {
              suggestions.filter(user => user.login.includes(searchUser)).slice(0, 10).map((user, i) => 
                <li style={{"--delay":`${(i + 1) * 0.1 + 0.3}s`}} className={ activeSuggestionIndex === i ? "active" : null } onClick={() => selectSuggestion(user.login)}>{user.login}</li>
              )
            }
          </ul>
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Homepage;

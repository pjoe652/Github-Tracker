import { useState } from "react";
import { useHistory } from "react-router";

function Navbar(props) {
  const { searchUser, suggestions, setSearchUser, submitUserSearch, selectSuggestion } = props
  const [displaySuggestions, toggleDisplaySuggestions] = useState(false)
  const history = useHistory()

  const delayedToggleDisplaySuggestion = (change) => {
    setTimeout(() => {
      toggleDisplaySuggestions(change)
    }, 200);
  }

  return (
    <div className="userpage-navbar">
      <i className="fab fa-github-alt userpage-header" onClick={() => history.push("/")}/>
      <form className="userpage-form" onSubmit={(e) => submitUserSearch(e)}>
        <div className="input-dropdown-suggestions">
          <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search for a user" onFocus={() => toggleDisplaySuggestions(true)} onBlur={() => delayedToggleDisplaySuggestion(false)} />
          <ul className={suggestions.length > 0 ? "available" : "no-suggestions"}>
            {
              suggestions.filter(user => user.includes(searchUser) && displaySuggestions).map((user, i) => 
                <li key={`${user}`} style={{"--delay":`${(i + 1) * 0.1 + 0.3}s`}} onClick={() => selectSuggestion(user)}>{user}</li>
              )
            }
          </ul>
        </div>
        <button type="submit"><i class="fas fa-search" /></button>
      </form>
    </div>
  )
}

export default Navbar;
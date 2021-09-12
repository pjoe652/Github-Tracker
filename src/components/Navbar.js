import { useState } from "react";

function Navbar(props) {
  const { searchUser, suggestions, setSearchUser, submitUserSearch } = props
  const [displaySuggestions, toggleDisplaySuggestions] = useState(false)

  const delayedToggleDisplaySuggestion = (change) => {
    setTimeout(() => {
      toggleDisplaySuggestions(change)
    }, 200);
  }

  return (
    <div className="userpage-navbar">
      <span className="userpage-header">Github User Search</span>
      <form className="userpage-form" onSubmit={(e) => submitUserSearch(e)}>
        <div className="input-dropdown-suggestions">
          <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} onFocus={() => toggleDisplaySuggestions(true)} onBlur={() => delayedToggleDisplaySuggestion(false)}/>
          <ul className={suggestions.length > 0 ? "available" : "no-suggestions"}>
            {
              suggestions.filter(user => user.includes(searchUser) && displaySuggestions).map((user, i) => 
                <li style={{"--delay":`${(i + 1) * 0.1 + 0.3}s`}} onClick={() => setSearchUser(user)}>{user}</li>
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
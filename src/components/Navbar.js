import { useEffect, useState } from "react";
import { useHistory } from "react-router";

function Navbar(props) {
  const { searchUser, suggestions, setSearchUser, submitUserSearch, selectSuggestion } = props
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [displaySuggestions, toggleDisplaySuggestions] = useState(false)
  const history = useHistory()

  const onKeyDown = (e) => {
    // Enter key
    if (e.keyCode === 13) {
      selectSuggestion(suggestions[activeSuggestion])
    } 
    // Down key
    else if (e.keyCode === 40) {
      setActiveSuggestion(activeSuggestion + 1 >= suggestions.length ? 0 : activeSuggestion + 1)
    }
    // Up key
    else if (e.keycode === 38) {
      setActiveSuggestion(activeSuggestion - 1 < 0 ? suggestions.length - 1 : activeSuggestion - 1)
    }
  }

  useEffect(() => {
    setActiveSuggestion(0)
  }, [suggestions])

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
          <input value={searchUser} onKeyDown={(e) => onKeyDown(e)} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search for a user" onFocus={() => toggleDisplaySuggestions(true)} 
          onBlur={() => delayedToggleDisplaySuggestion(false)} 
          />
          <ul className={suggestions.length > 0 ? "available" : "no-suggestions"}>
            {
              suggestions.filter(user => displaySuggestions).map((user, i) => 
                <li className={activeSuggestion === i ? "active" : null} key={`${user}`} style={{"--delay":`${(i + 1) * 0.1 + 0.3}s`}} onClick={() => selectSuggestion(user)}>{user}</li>
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
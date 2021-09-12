function UserSearch(props) {
  const { sortType, setSortType, sortedSuggestions, selectUser } = props

  return (
    <div className="userpage-user-content-container">
      <select className="sort-select" onChange={(e) => setSortType(e.target.value)}>
        <option value="created_at">Created At</option>
        <option value="followers">Followers</option>
        <option value="public_repos">Public Repos</option>
      </select>
      <div className="suggested-users-container">
        {
          sortedSuggestions.sort((a, b) => {return b[sortType] - a[sortType]}).map(user => 
            <div className="suggested-user-wrapper" onClick={() => selectUser(user.login)}>
              <span>{user.login}</span>
              <span>{sortType === "created_at" ? new Date(user[sortType]).toLocaleDateString("en-US") : user[sortType]}</span>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default UserSearch;
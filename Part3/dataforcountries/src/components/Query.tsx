import React from "react";

const Query = ({ searchTerm, searchHandler }) => {
  return (
    <div>
      <p>
        find countries <input value={searchTerm} onChange={searchHandler}/>
      </p>
    </div>
  );
};
export default Query;
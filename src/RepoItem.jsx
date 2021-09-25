import React from 'react';
import styled from 'styled-components';

const RepoItem = ({ repo }) => {
  const handleColumnClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  }

  return (
    <Column onClick={() => handleColumnClick(repo.html_url)}>
      {repo.name}
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <path d="M8 .2l4.9 15.2L0 6h16L3.1 15.4z" fill="currentColor" />
        </svg>
        &nbsp;
        {repo.stargazers_count}
      </div>
    </Column>
  );
};

export default RepoItem;

const Column = styled.li`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  color: gray;
`;

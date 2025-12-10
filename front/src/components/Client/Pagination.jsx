import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(Pagination)`
  .MuiPaginationItem-root {
    border-radius: 2px;
    margin: 0 4px;
    min-width: 32px;
    height: 32px;
  }

  .MuiPaginationItem-page.Mui-selected {
    background-color: #3C3C43;
    color: white;
  }
`;

const SimplePagination = ({ count, page, onChange }) => {
  return (
    <StyledPagination
      count={count}
      page={page}
      onChange={onChange}
      shape="rounded"
      variant="outlined"
      size="medium"
      siblingCount={0}
      boundaryCount={1}
      renderItem={(item) => {
        if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
          return <PaginationItem {...item} disabled>...</PaginationItem>;
        }
        return <PaginationItem {...item} />;
      }}
    />
  );
};

export default SimplePagination;
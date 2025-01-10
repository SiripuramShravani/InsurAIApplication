import React, { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import MDInput from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDInput";
import MDPagination from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDPagination";
import DataTableHeadCell from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable/DataTableBodyCell";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  paginationColor,
  isSorted,
  noEndBorder,
  backColor, 
  searchKeys = [],
  AgentName,
  AgentID 
}) {
  const defaultValue = entriesPerPage.defaultValue
    ? entriesPerPage.defaultValue
    : 10;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const [globalFilter, setGlobalFilter] = useState("");

  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value);
  }, 300);

// Recursive function to extract text from React elements or strings
const getTextFromValue = (value) => {
  if (React.isValidElement(value)) {
    if (value.type === AgentName) { // Check if it's the AgentName component
      return value.props.name.toLowerCase(); // Return only the name prop
    }  else if (value.type === AgentID) { 
      const agentIDValue = value.props.number;
      return typeof agentIDValue === 'string' 
        ? agentIDValue.toLowerCase() // Apply toLowerCase() if it's a string
        : String(agentIDValue).toLowerCase(); // Convert to string first if it's not
    }     
    else {
      // Extract text from other React elements, preserving spaces
      const extractedText = React.Children.map(value.props.children, (child) => {
        if (typeof child === 'string') {
          return child; 
        } else if (React.isValidElement(child)) {
          return getTextFromValue(child); 
        } else {
          return ''; 
        }
      });

      return extractedText ? extractedText.join('') : ''; 
    }
  } else if (typeof value === "object" && value !== null) {
    return Object.values(value).map(getTextFromValue).join("");
  } else {
    return String(value).toLowerCase(); 
  }
};

const getFilteredData = () => {
  const filterText = globalFilter.toLowerCase(); // Convert search term to lowercase

  return data.filter((row) => {
    return searchKeys.some((key) => {
      const value = row[key];
      return getTextFromValue(value).includes(filterText); // Use lowercase for comparison
    });
  });
};

  const filteredData = useMemo(() => getFilteredData(), [globalFilter, data]);

  const tableInstance = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  const setEntriesPerPage = (value) => setPageSize(value);

  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0
      ? gotoPage(0)
      : gotoPage(Number(value));

  const customizedPageOptions = pageOptions.map((option) => option + 1);

  const handleInputPaginationValue = ({ target: value }) =>
    gotoPage(Number(value.value - 1));

  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  const entriesEnd = Math.min(
    pageIndex === 0
      ? pageSize
      : pageIndex === pageOptions.length - 1
      ? rows.length
      : pageSize * (pageIndex + 1),
    rows.length
  );
  const tableContainerStyle = {
    boxShadow: "none",
  };

  if (backColor) {
    tableContainerStyle.background =
      "linear-gradient(to bottom, #010066, #010033)";
  }

   // Define setSortedValue here, within the DataTable component
   const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };
  

  return (
    <TableContainer sx={tableContainerStyle}>
      {entriesPerPage || canSearch ? (
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDTypography variant="caption" color="secondary">
                  entries per page
              </MDTypography>
            </MDBox>
          )}
          {canSearch && (
            <MDBox width="12rem" ml="auto">
              <MDInput
                placeholder="Search..."
                value={globalFilter} 
                size="small"
                fullWidth
                inputProps={{ style: { color: backColor ? "white" : "inherit" } }} 
                onChange={({ currentTarget }) => {
                  onSearchChange(currentTarget.value);
                }}
              />
            </MDBox>
          )}
        </MDBox>
      ) : null}
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(
                    isSorted && column.getSortByToggleProps()
                  )}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <TableRow key={key} {...row.getRowProps()}>
                {row.cells.map((cell, idx) => (
                  <DataTableBodyCell
                    key={idx}
                    noBorder={noEndBorder && rows.length - 1 === key}
                    align={cell.column.align ? cell.column.align : "left"}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </DataTableBodyCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {rows.length} entries
            </MDTypography>
          </MDBox>
        )}
        {pageOptions.length > 1 && (
          <MDPagination
          variant={pagination.variant ? pagination.variant : "gradient"}
          color={paginationColor || (pagination.color ? pagination.color : "info")}
        >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}
            {renderPagination.length > 6 ? (
              <MDBox width="5rem" mx={1}>
                <MDInput
                  inputProps={{
                    type: "number",
                    min: 1,
                    max: customizedPageOptions.length,
                  }}
                  value={customizedPageOptions[pageIndex]}
                  onChange={(handleInputPagination, handleInputPaginationValue)}
                />
              </MDBox>
            ) : (
              renderPagination
            )}
            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </TableContainer>
  );
}

DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  backColor: PropTypes.bool,
  paginationColor: PropTypes.string,
};

export default DataTable;
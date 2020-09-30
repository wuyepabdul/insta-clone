import React from "react";

export const showSuccessMessage = (msg) => (
  <div className="alert alert-success">{msg}</div>
);

export const showErrorMessage = (msg) => (
  <div className="alert alert-danger">{msg}</div>
);

export const showNoDataError = (msg) => (
  <div className="alert alert-warning" role="alert">
    <button
      type="button"
      className="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
    {msg}
  </div>
);

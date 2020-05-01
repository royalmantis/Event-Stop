import React from "react";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
 
// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  text-align: center;
  margin: 25vh auto;
  border-color: #000cdd
`;
 
export class LoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
 
  render() {
    return (
      <div className="sweet-loading">
        <BeatLoader
          css={override}
          size={25}
          color={"#000cdd"}
          loading={this.state.loading}
        />
      </div>
    );
  }
};
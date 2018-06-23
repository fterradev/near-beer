import React, { PureComponent } from 'react';

class InfoWindow extends PureComponent {
  state = {
    visitCount: 0
  };

  render() {
    const { name } = this.props;
    const { visitCount } = this.state;
    return (
      <div>
        <h2>{name}</h2>
        <span>I visited it {visitCount} times.</span>
        <i
          className="fa fa-plus-circle"
          style={{
            fontSize: 'x-large',
            float: 'right'
          }}
          onClick={() => this.setState(
            prevState => ({
              visitCount: prevState.visitCount + 1
            })
          )} />
      </div>
    );
  }
}

export default InfoWindow;
import React from 'react';
import { connect } from 'react-redux';
import EventListItem from './EventListItem';
import getVisibleEvents from '../selectors/selectEvents';


export const EventList = (props) => (
  <div className="container">    
     <div className="p-3 my-2 rounded bg-docs-transparent-grid">
        <div className="row">
                  {props.events.length === 0 ? (<h1 className = "filter-text">No events</h1>) : (
                    props.events.map((event) => {
                      return <div key={event.id} className="col-sm-4">
                                <div className="card shadow p-3 mb-5 bg-white rounded">
                                  <div className="card-body d-flex flex-column">
                                    <EventListItem key={event.id} {...event} />
                                  </div>
                                </div>
                              </div>      
                        })
                    )
                  }
          </div>
      </div>
  </div>
);

const mapStateToProps = (state) => {
  return {
    events: getVisibleEvents(state.events, state.filters)
  };
};

export default connect(mapStateToProps)(EventList);

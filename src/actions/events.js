import { v4 as uuidv4 } from 'uuid';
import database from '../firebase/firebase';
import { storage } from '../firebase/firebase';


// component calls action generator
// action generator returns object
// component dispatches object
// redux store changes

// component calls action generator
// action generator returns function
// component dispatches function(?) // redux by default does not let you dispatch functions
// function runs (redux will execute internally) (firebase code goes here)

export const addEvent = (event) => ({
    type: 'ADD_EVENT',
    event
});

export const startAddEvent = (eventData = {}) => {
    return (dispatch, getState) => {
      const uid = getState().auth.uid;
      const {
        description = '',
        note = '',
        amount = 0,
        createdAt = 0,
        time = '',
        public_event = false,
        picture = '',
        pictureUrl = ''
      } = eventData;
      const event = { description, note, amount, createdAt, time, public_event, picture, pictureUrl };
      
      if (event.public_event === true) {
        storage.child(`users/${uid}/${uuidv4()}`).put(picture).then((snapshot) => {
          const imgurl = snapshot.metadata.downloadURLs[0];
          event.pictureUrl = imgurl;
          return database.ref(`users/${uid}/events`).push(event).then((ref) => {
            const test = ref.key;
            //console.log(test);
            database.ref(`/public_events/`).push({
              description: event.description,
              note: event.note,
              amount: event.amount,
              createdAt: event.createdAt,
              time: event.time,
              public_event: event.public_event,
              pictureUrl: event.pictureUrl,
              remember: test
             });
            dispatch(addEvent({
              id: ref.key,
              ...event
            }));
            
          }).catch((e) => {
            console.log(e);
          })

        });

      } else {
          storage.child(`users/${uid}/${createdAt}`).put(picture).then((snapshot) => {
            const imgurl = snapshot.metadata.downloadURLs[0];
            event.pictureUrl = imgurl;
            return database.ref(`users/${uid}/events`).push(event).then((ref) => {
              dispatch(addEvent({
                id: ref.key,
                ...event
              }));
            });
          });     
        }
    };
  };

export const removeEvent = ({ id }={}) => ({
    type: 'REMOVE_EVENT',
    id
});

export const startRemoveEvent = ({ id } = {}) => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        console.log(id);
        database.ref('public_events').orderByChild(`remember`).equalTo(`${id}`).on("value", (snapshot) => {
          console.log(snapshot.val());
          
          snapshot.forEach((data) => {
            const deletionID = data.key; // ID
            return database.ref(`public_events/${deletionID}`).remove()
          })
        })
        return database.ref(`users/${uid}/events/${id}`).remove().then(() => {
            dispatch(removeEvent({ id }));
        });
    };
};



export const editEvent = (id, updates) => ({ //implicitly return an object
    type: 'EDIT_EVENT',
    id,
    updates
});

export const startEditEvent = (id, updates) => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        const createdAt = updates.createdAt;
        const picture = updates.picture;
        
        if(!picture){
          return database.ref(`users/${uid}/events/${id}`).update({ amount: updates.amount, 
                                                                    createdAt: updates.createdAt, 
                                                                    description: updates.description,
                                                                    note: updates.note,
                                                                    public_event: updates.public_event,
                                                                    time: updates.time
                                                                    }).then(() => {
            dispatch(editEvent(id, updates));
          })
        } else {
          storage.child(`users/${uid}/${uuidv4()}`).put(picture).then((snapshot) => {
            const imgurl = snapshot.metadata.downloadURLs[0];
            updates.pictureUrl = imgurl;
            
            return database.ref(`users/${uid}/events/${id}`).update({ amount: updates.amount, 
              createdAt: updates.createdAt, 
              description: updates.description,
              note: updates.note,
              public_event: updates.public_event,
              time: updates.time,
              pictureUrl: updates.pictureUrl
              }).then(() => {
              dispatch(editEvent(id, updates));
            })
          })
        } 
    }
}


export const setEvents = (events) => ({
    type: 'SET_EVENTS',
    events
  });
  
  export const startSetEvents = () => {
    return (dispatch, getState) => {
      const uid = getState().auth.uid;
      return database.ref(`users/${uid}/events`).once('value').then((snapshot) => {
        const events = [];
  
        snapshot.forEach((childSnapshot) => {
          events.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
  
        dispatch(setEvents(events));
      });
    };
  };

  export const setPublicEvents = (publicEvents) => ({
    type: 'SET_PUBLIC_EVENTS',
    publicEvents
  });

  export const startSetPublicEvents = () => {
    return (dispatch) => {
      return database.ref(`public_events`).once('value').then((snapshot) => {
        const publicEvents = [];
  
        snapshot.forEach((childSnapshot) => {
          publicEvents.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
  
        dispatch(setPublicEvents(publicEvents));
      });
    };
  };




import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';


const App = () => {

    const [activities, setActivities] = useState<IActivity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false)

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(a => a.id === id)[0])
        setEditMode(false);
    }

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);  
        setEditMode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);
        updateActivityDetails(activity, false)
    }

    const handleEditActivity = (activity: IActivity) => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        updateActivityDetails(activity, false)
    }

    const handleDelectActivity = (id: string) => {
        if (selectedActivity?.id === id) {
            setSelectedActivity(null);
        }
        setActivities([...activities.filter(a => a.id !== id)]);
    }

    const updateActivityDetails = (activity: IActivity, editMode: boolean) => {
        setSelectedActivity(activity);
        setEditMode(editMode);
    }

    useEffect(() => {
        axios
            .get<IActivity[]>('http://localhost:5000/api/activities') 
            .then(response => {
                const activities = [];
                for (let i=0; i < response.data.length; i++){
                    activities.push(response.data[i])
                    activities[i].date = response.data[i].date.split('.')[0]
                } 
                setActivities(activities);
            })
    }, []);

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard 
                    activities={activities} 
                    selectActivity={handleSelectActivity}
                    selectedActivity={selectedActivity!}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDelectActivity}
                />
            </Container>
        </Fragment>
      );  
}

export default App;

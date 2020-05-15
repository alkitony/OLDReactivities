import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import { LoadingComponent } from './LoadingComponent';

const App = () => {

    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [target, setTarget] = useState<string>('');

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(a => a.id === id)[0])
        setEditMode(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);  
        setEditMode(true);
    };

    const handleCreateActivity = (activity: IActivity) => {
        setSubmitting(true)
        agent.Activities.create(activity)
            .then(() => {
                setActivities([...activities, activity]);
                updateActivityDetails(activity, false);
            })
            .then(() => setSubmitting(false)
            );
    };

    const handleEditActivity = (activity: IActivity) => {
        setSubmitting(true)
        agent.Activities.update(activity)
            .then(() => {
                setActivities([...activities.filter(a => a.id !== activity.id), activity]);
                updateActivityDetails(activity, false);
            })
            .then(() => setSubmitting(false)
            );
    };

    const handleDelectActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setSubmitting(true)
        setTarget(event.currentTarget.name);
        agent.Activities.delete(id)
            .then(() => {
                if (selectedActivity?.id === id) {
                    setSelectedActivity(null);
                }
                setActivities([...activities.filter(a => a.id !== id)]);
            })
            .then(() => setSubmitting(false)
            );
    };

    const updateActivityDetails = (activity: IActivity, editMode: boolean) => {
        setSelectedActivity(activity);
        setEditMode(editMode);
    };

    useEffect(() => {
        agent.Activities.list()
            .then(response => {
                const activities = [];
                for (let i=0; i < response.length; i++){
                    activities.push(response[i])
                    activities[i].date = response[i].date.split('.')[0]
                } 
                setActivities(activities);
            })
            .then(() => setLoading(false));
    }, []);

    if (loading) return <LoadingComponent content='Loading Activities...' />;

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} submitting={submitting}/>
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
                    submitting={submitting}
                    target={target}
                />
            </Container>
        </Fragment>
    );  
}

export default App;

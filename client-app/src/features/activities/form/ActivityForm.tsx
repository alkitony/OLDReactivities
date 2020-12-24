import React, { useContext, FormEvent, useState, useEffect } from 'react';
<<<<<<< HEAD
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
=======
import { Segment, Form, Button } from 'semantic-ui-react'
>>>>>>> 9b72459a3930b8cb3e16f306781e9b279b822dd5
import {v4 as uuid} from 'uuid'
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'
import { IActivity } from '../../../app/models/activity';
import { RouteComponentProps } from 'react-router-dom';
import { IActivityIDParam } from '../../../app/models/activityIDParam';

const ActivityForm : React.FC<RouteComponentProps<IActivityIDParam>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore)
    const { submitting,
        activity: activityFormState,
        formChanges,
        setFormChanges,
        loadActivity,
        createActivity,
        editActivity, 
        initializeForm,
        setSelectedActivity} = activityStore

    const [activity, setActivity] = useState<IActivity>(initializeForm())
        
    useEffect(() => {
        setFormChanges(false);
        if (match.params.id) {
            loadActivity(match.params.id).then(() => setActivity(initializeForm()))
        } else {
            setSelectedActivity(null);
            setActivity(initializeForm())
        }
        return
    }, [match.params.id, 
        activityFormState,
        activity.id,
        setFormChanges,
        loadActivity, 
        initializeForm, 
        setSelectedActivity,
        setActivity ])

    const handleSubmit = () => {
        if (formChanges) {
            if (activity.id.length === 0) {
                let newActivity = {...activity, id: uuid()};
                createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
            } else {
                editActivity(activity).then(() => history.push(`/activities/${activity.id}`))
            }
            setFormChanges(false);
        } else {
            if (activity.id) {
                history.push(`/activities/${activity.id}`)
            } else {
                history.push('/activities')
            }
        }
    }
    
    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value})
        setFormChanges(true);
    }

    return (
<<<<<<< HEAD
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            placeholder='Title' 
                            onChange={handleInputChange} 
                            name='title' 
                            value={activity.title}
                        />
                        <Form.TextArea 
                            rows={2} 
                            placeholder='Description' 
                            onChange={handleInputChange}
                            name='description' value={activity.description}
                        />
                        <Form.Input 
                            placeholder='Category'
                            onChange={handleInputChange}
                            name='category'
                            value={activity.category}
                        />
                        <Form.Input
                            type='datetime-local'
                            placeholder='Date'
                            onChange={handleInputChange}
                            name='date'
                            value={activity.date}
                        />
                        <Form.Input
                            placeholder='City'
                            onChange={handleInputChange}
                            name='city'
                            value={activity.city}
                        />
                        <Form.Input
                            placeholder='Venue'
                            onChange={handleInputChange}
                            name='venue'
                            value={activity.venue}
                        />
                        <Button 
                            loading={submitting}
                            disabled={submitting}
                            floated='right'
                            positive type='submit'
                            content='Submit'
                        />
                        <Button 
                            onClick={() => setFormChanges(false)}
                            disabled={submitting}
                            floated='right' 
                            type='submit' 
                            content='Cancel'
                        />
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
=======
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    placeholder='Title' 
                    onChange={handleInputChange} 
                    name='title' 
                    value={activity.title}
                />
                <Form.TextArea 
                    rows={2} 
                    placeholder='Description' 
                    onChange={handleInputChange}
                    name='description' value={activity.description}
                />
                <Form.Input 
                    placeholder='Category'
                    onChange={handleInputChange}
                    name='category'
                    value={activity.category}
                />
                <Form.Input
                    type='datetime-local'
                    placeholder='Date'
                    onChange={handleInputChange}
                    name='date'
                    value={activity.date}
                />
                <Form.Input
                    placeholder='City'
                    onChange={handleInputChange}
                    name='city'
                    value={activity.city}
                />
                <Form.Input
                    placeholder='Venue'
                    onChange={handleInputChange}
                    name='venue'
                    value={activity.venue}
                />
                <Button 
                    loading={submitting}
                    disabled={submitting}
                    floated='right'
                    positive type='submit'
                    content='Submit'
                />
                <Button 
                    onClick={() => setFormChanges(false)}
                    disabled={submitting}
                    floated='right' 
                    type='submit' 
                    content='Cancel'
                />
            </Form>
        </Segment>
>>>>>>> 9b72459a3930b8cb3e16f306781e9b279b822dd5
    );
};

export default observer(ActivityForm);
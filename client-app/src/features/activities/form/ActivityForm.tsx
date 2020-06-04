import React, { useContext, FormEvent, useState } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react'
import {v4 as uuid} from 'uuid'
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'
import { IActivity } from '../../../app/models/activity';

const ActivityForm : React.FC = () => {
    const activityStore = useContext(ActivityStore)
    const { submitting,
        createActivity,
        editActivity,
        initializeForm,
        setEditMode } = activityStore

    const [activity, setActivity] = useState<IActivity>(initializeForm())

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {...activity, id: uuid()};
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value})
    }

    return (
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
                    onClick={() => setEditMode(false)}
                    disabled={submitting}
                    floated='right' 
                    type='submit' 
                    content='Cancel'
                />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);
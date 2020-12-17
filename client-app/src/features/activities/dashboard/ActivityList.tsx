import React, { useContext } from 'react'
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'
import { Link } from 'react-router-dom';

const ActivityList = () => {
    const activityStore = useContext(ActivityStore)
    const {activitiesByDate, submitting, target, deleteActivity } = activityStore

    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>  
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    name={activity.id}
                                    disabled={submitting}
                                    loading={target === activity.id && submitting}
                                    onClick={(e) => deleteActivity(e, activity.id)}
                                    floated='right' 
                                    content='Delete' 
                                    color='red'
                                />
                                <Button
                                    as={Link} to={`/activities/${activity.id}`}
                                    disabled={submitting}
                                    floated='right' 
                                    content='View' 
                                    color='blue'
                                />
                                <Label basic content={activity.category}/>
                          </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
};

export default observer(ActivityList);
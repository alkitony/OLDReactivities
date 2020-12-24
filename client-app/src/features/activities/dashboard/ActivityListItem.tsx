import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/activityStore'

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {

    const activityStore = useContext(ActivityStore)
    const {submitting } = activityStore

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content verticalAlign='middle'>
                            <Item.Header as={Link} to={`/activities/${activity.id}`} >{activity.title}</Item.Header>
                            <Item.Description floated='right'>
                                Hosted by someone
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <div>
                   <div>
                       <Icon floated='left' name='clock' /> {activity.date}
                   </div>
                   <div>
                       <Icon floated='right' name='marker'/> {activity.venue}, {activity.city}
                   </div>
                </div>               
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link} to={`/activities/${activity.id}`}
                    disabled={submitting}
                    floated='right' 
                    content='View' 
                    color='blue'
                />
            </Segment>
        </Segment.Group>
    )
}

import React, { Fragment, useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'
import { ActivityListItem } from './ActivityListItem';

const ActivityList = () => {
    const activityStore = useContext(ActivityStore);
    const {activitiesByDate } = activityStore;
    return (
        <Fragment>
            {activitiesByDate.map(([groupDate, activities]) => {
                return (
                    <Fragment key={groupDate}>
                        <Label size='large' color='blue'>
                            {groupDate}
                        </Label>
                        <Item.Group divided>
                            {activities.map(activity => {
                                return <ActivityListItem key={activity.id} activity={activity}/>
                            })}
                        </Item.Group>
                    </Fragment>
                )
            })}
        </Fragment>
    );
};

export default observer(ActivityList);


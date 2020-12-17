import React, { useContext, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { Link, RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { IActivityIDParam} from '../../../app/models/activityIDParam'

const ActivityDetails: React.FC<RouteComponentProps<IActivityIDParam>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { activity, submitting, loadingInitial, loadActivity } = activityStore

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id])

    if (loadingInitial || !activity) return <LoadingComponent content='Loading activity ...' />

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity!.title}</Card.Header>
                <Card.Meta>
                    <span>{activity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity!.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button
                        as={Link} to={`/editActivity/${activity.id}`}
                        disabled={submitting}
                        basic
                        color='blue'
                        content='Edit'
                    />
                    <Button
                        onClick={() => history.push("/activities")}
                        disabled={submitting}
                        basic
                        color='grey'
                        content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);
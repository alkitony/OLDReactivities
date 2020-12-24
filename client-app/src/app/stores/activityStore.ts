import {observable, action, computed, configure, runInAction} from 'mobx';
import 'mobx-react-lite/batchingForReactDom';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial: boolean = false;
    @observable formChanges: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        )
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities
        }, {} as {[key: string]: IActivity[]}));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const apiActivities = await agent.Activities.list();
            runInAction('load activities', () => {
                for (let i=0; i < apiActivities.length; i++){
                    this.activityRegistry.set(apiActivities[i].id, apiActivities[i]);
                    this.activityRegistry.get(apiActivities[i].id).date = apiActivities[i].date.split('.')[0];
                }
                this.loadingInitial = false;
            })
        } catch (error) {
            console.log(error);
            runInAction('load activities errors', () => {
                this.loadingInitial = false;
            })
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.activityRegistry.get(id);
        if (activity) {
            this.activity = activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                console.log(error);
                runInAction('Loading Activity Error', () => this.loadingInitial = false)     
            }
        }
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('Create new activity', () => {
                this.activityRegistry.set(activity.id, activity);
            })
            this.setSelectedActivity(activity);
            this.setSubmitting(false);
        } 
        catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.update(activity);
            runInAction('edit activity', () => {
                this.activityRegistry.set(activity.id, activity)
            })
            this.setSubmitting(false);
        } 
        catch (error) {
            console.log(error);
            this.setSubmitting(false);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.setSubmitting(true);
        this.setTarget(event.currentTarget.name)
        try {
            await agent.Activities.delete(id);
            if (this.activity?.id === id) {
                this.setSelectedActivity(null);
            }
            runInAction('deleting activity in registry', () => {
                this.activityRegistry.delete(id);
            })
            this.setSubmitting(false);
        } 
        catch (error) {
            console.log(error);    
            this.setSubmitting(false);
        }
    }

    @action initializeForm = () => {
        if (this.activity) {
            return this.activity
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    }

    @action setFormChanges = (formChangesValue: boolean) => {
        this.formChanges = formChangesValue;
    }

    @action setSelectedActivity = (activity: IActivity | null) => {
        this.activity = activity;
    }

    @action setSubmitting = (submittingValue: boolean) => {
        this.submitting = submittingValue;
    }

    @action setTarget = (targetValue: string) => {
        this.target = targetValue
    }
}

export default createContext(new ActivityStore())
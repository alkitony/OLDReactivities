import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | null = null;
    @observable loadingInitial: boolean = false;
    @observable editMode: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date));
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

    @action selectActivity = (id: string) => {
        this.setSelectedActivity(this.activityRegistry.get(id));
        this.setEditMode(false);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('Create new activity', () => {
                this.activityRegistry.set(activity.id, activity);
            })
            this.setSelectedActivity(activity);
            this.setEditMode(false);
            this.setSubmitting(false);
        } 
        catch (error) {
            console.log(error);
            this.setEditMode(false);
            this.setSubmitting(false);
        }
    }

    @action openCreateForm = () => {
        this.setSelectedActivity(null);
        this.setEditMode(true);
    }

    @action editActivity = async (activity: IActivity) => {
        this.setSubmitting(true);
        try {
            await agent.Activities.update(activity);
            runInAction('edit activity', () => {
                this.activityRegistry.set(activity.id, activity)
            })
            this.setSelectedActivity(activity);
            this.setEditMode(false);
            this.setSubmitting(false);
        } 
        catch (error) {
            console.log(error);
            this.setEditMode(false);
            this.setSubmitting(false);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.setSubmitting(true);
        this.setTarget(event.currentTarget.name)
        try {
            await agent.Activities.delete(id);
            if (this.selectedActivity?.id === id) {
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
        if (this.selectedActivity) {
            return this.selectedActivity
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

    @action setEditMode = (editModeValue: boolean) => {
        this.editMode = editModeValue;
    }

    @action setSelectedActivity = (activity: IActivity | null) => {
        this.selectedActivity = activity;
    }

    @action setSubmitting = (submittingValue: boolean) => {
        this.submitting = submittingValue;
    }

    @action setTarget = (targetValue: string) => {
        this.target = targetValue
    }

    // @action handleSubmit = (activity : IActivity) => {
    //     if (activity.id.length === 0) {
    //         let newActivity = {...activity, id: uuid()};
    //         this.createActivity(newActivity);
    //     } else {
    //         this.editActivity(activity);
    //     }
    // }

  //  @action handleInputChange = (
  //      event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
  //      changeActivity: IActivity) => {
  //          const {name, value} = event.currentTarget;
  //          this.ac
  //          this.selectedActivity = {...changeActivity, [name]: value};
  //          this.
  //          const [activity, setActivity] = useState<IActivity>(changeActivity)
//
  //          setActivity({...activity, [name]: value})
  //  }

//    @action deleteActivity = async {id: string} => {
//        this.submitting
//    }

}

export default createContext(new ActivityStore())
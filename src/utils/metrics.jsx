import { useSelector } from "react-redux";
import * as amplitude from "@amplitude/analytics-browser";
import { useLocalStorage } from "hook/useLocalStorage";

amplitude.init("ca69a852979ce6396e242847e3813b47");

const currentWorkspace = (myWorkSpaces, localValue) => {
    return myWorkSpaces?.workspaces?.find((workspace) => workspace?.id === localValue) || {};
};

export const useTrackUserMetric = () => {
    const { localValue } = useLocalStorage("vultron_workspace_id", "");
    const { myWorkSpaces } = useSelector((store) => store.auth);
    const workspace = currentWorkspace(myWorkSpaces, localValue);

    const trackUserEvent = (eventInput, properties) => {
        const eventProperties = {
            ...properties,
            email: myWorkSpaces?.email,
            workspace: workspace.name,
            company: workspace.company_name,
        };
        amplitude.track(eventInput, eventProperties);
    };

    return trackUserEvent;
};

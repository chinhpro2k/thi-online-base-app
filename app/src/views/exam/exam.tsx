import * as React from "react";
import {UserInfo} from "@/src/components/user-info";
import AppThiOnline from "@/src/components/app-thionline/app-thionline";

export default class Exam extends React.Component<any, any>{
    handleNavigate=(path:string)=>{
        this.props.navigate(path)
    }
    render() {
        return(
            <>
            <AppThiOnline navigate={(path)=>this.handleNavigate(path)}/>
            </>
        )
    }
}
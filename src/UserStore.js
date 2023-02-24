import { action, computed, makeObservable, observable, autorun, runInAction } from "mobx";

class UserStore{
    userinfo={
        idcode:"CS1210",
        name:"Dhanashree",
        modal:false,
        subject:["maths","English"]
    }

    constructor(){
        makeObservable(this,{
            userinfo:observable,
            totalsub:computed,
            updateUSer:action,
            addsub:action,
        })
        autorun(this.loguserinfo)
        runInAction(this.prefetchdata)
    }
get totalsub(){
    console.log("getter")
    return this.userinfo.subject.length
}
prefetchdata (){
    console.log("run in action")
}
    loguserinfo=()=>{
console.log("YEsssssssssss"+this.totalsub)
    }
    updateUSer(name){
return this.userinfo.name=name
    };
    addsub(data){
        return this.userinfo.subject=[...this.userinfo.subject,data]
    }
}
export default  UserStore;  
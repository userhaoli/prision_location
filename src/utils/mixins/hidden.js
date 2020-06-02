const  hidden = {
    data(){
      return {
         compIsHidden:false
      }
    },
    methods:{
       hiddenComp(){
           this.compIsHidden = true;
       }
    }
}

export default hidden;

define([
        "dojo/_base/declare",
        "dojo/store/Memory",
        "dojo/json"
],
    function(
        declare,
        Memory,
        json
        ){

        var syncWrapper=function(){
            this.inherited(arguments);
            console.log(arguments);
            this._sync();
        };

        return declare(Memory, {
            constructor: function(options){
                if(options.store_name){
                    this.setData(json.parse(localStorage.getItem(this.store_name))||[]);
                    this._sync();
                }else{
                    throw new Error('Local store need set a name');
                }
            },
            put:function(){
                this.inherited(arguments);
                this._sync();
            },
            add:function(){
                this.inherited(arguments);
                this._sync();
            },
            remove:function(){
                this.inherited(arguments);
                this._sync();
            },
            _sync:function(){
                localStorage.setItem(this.store_name,json.stringify(this.data));
            }
        });
    });

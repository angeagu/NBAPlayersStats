define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojox/mobile/ListItem",
        "dojox/mobile/ProgressIndicator",
        "nba-player-stats/config/appConfig",
        "nba-player-stats/widgets/helpUtils"
    ],
    function (declare, array, dom, domConstruct, domGeometry, domClass, domStyle, ListItem, ProgressIndicator, appConfig, helpUtils) {
        var MenuListItem = declare(ListItem, {});

        return {

            beforeActivate: function () {
                var _t = this;
                this.config = appConfig[appConfig.selectedCustomer]
                this.closeWelcomeScreen();
                this.setHeader();
                this.icons = [];

                this.playerArray = helpUtils.getPlayerArray();
                _t.loadedStores.playerList.setData(this.playerArray);

                array.forEach(this.config.mainMenu, function (configItem, i) {
                    var menuItem = new MenuListItem()
                    menuItem.labelNode.style.height = '0px';
                    var divLabel = domConstruct.create("div", {
                        className: "nbaPlayerStatsMenuItem",
                        layout: "left"
                    }, menuItem.domNode);
                    divLabel.innerHTML = '<div class="mblImageIcon mblListItemIcon nbaPlayerStatsHeaderIcon"><i class="' + configItem.icon + ' nbaPlayerStatsListItemIcon"></i></div>';
                    divLabel.innerHTML += '<div>' + configItem.title + '</div>';


                    menuItem.target = configItem.target;
                    menuItem.url = configItem.url;
                    _t.icons.push(configItem.icon);

                    var params = {};
                    params.t = Date.now();
                    if (configItem.path && configItem.target == 'htmlViewer') {
                        //Simple HTML Viewer
                        params.title = configItem.title;
                        params.path = configItem.path;
                    }
                    menuItem.transitionOptions = {params: params};

                    _t.mainMenu.addChild(menuItem);

                })
            },

            closeWelcomeScreen: function () {
                domConstruct.empty("frontDiv");
            },

            setHeader: function () {
                //Set Header
                var _t = this;
                //If no title, set image as whole header
                this.headerTitle.innerHTML = "NBA PLAYER STATS";//nls.menu[appConfig.selectedCustomer].title;
                var style = {"color": _t.config.header.textColor}
                domStyle.set(this.headerTitle, style);

                domConstruct.destroy(this.headerPadding);
                this.mainViewHeading.domNode.style.backgroundColor = this.config.header.mainMenuHeaderColor;
            },

            beforeDeactivate: function () {
                var _t = this;
                if (this.mainMenu.getChildren().length != 0) {
                    var children = this.mainMenu.getChildren();
                    array.forEach(children, function (child) {
                        _t.mainMenu.removeChild(child);
                    })
                }
            }

        }

    }
);




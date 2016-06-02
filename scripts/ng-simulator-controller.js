(function (angular) {
    'use strict';


    angular.module('core', []);
    angular.module('core')
        .filter('forMissions', function () {
            return function (campaigns, missions) {
                if (!campaigns || !missions) return campaigns;

                var newCampaigns = [];;
                for (var i = 0, len = campaigns.length; i < len; i++) {
                    var campaign = campaigns[i];
                    var missionsInCampaign = campaign.missions;
                    var isTitan = true;

                    for (var j = 0; j < missionsInCampaign.length; j++) {
                        var mission = missionsInCampaign[j];
                        if (!missions[mission]) {
                            isTitan = false;
                            break;
                        }
                    }
                    if (isTitan) {
                        newCampaigns.push(campaign);
                    }
                }
                return newCampaigns;
            };
        })
        .filter('inCampaign', function () {
            return function (missions, campaignID, campaigns) {
                var filteredMissions = [];
                var campaign = { missions: [] };
                campaigns = campaigns || [];
                for (var i = 0; i < campaigns.length; i++) {
                    if (campaigns[i].id == campaignID) {
                        campaign = campaigns[i];
                        break;
                    }
                }
                var campaignMissions = campaign.missions;
                for (var key in missions) {
                    if (campaignMissions.indexOf(key) >= 0) {
                        filteredMissions.push(missions[key]);
                    }
                }
               return filteredMissions;
            };
        });

    angular.module('simulatorApp', ['core'])
        .controller('SimulatorCtrl', ['$scope', '$window', SimulatorCtrl]);

    function SimulatorCtrl($scope, $window) {
        $scope.campaigns = [];
        $scope.missions = $window.TITANS;
        $scope.raids = $window.RAIDS;

        $scope.selections = {
            campaign: '',
            mission: '',
            raid: ''
        };

        $scope.titans = function () {
            $scope.campaigns = toArray($window.CAMPAIGNS);
            $scope.missions = $window.TITANS;
        };

        $scope.campaignSections = function () {
            var campaigns = $window.CAMPAIGNS;
            $scope.missions = $window.MISSIONS;
            var IDs = [];
            for (var key in campaigns) {
                IDs.push(key);
            }
            IDs.sort(function (a, b) {
                a = campaigns[a], b = campaigns[b];
                var locationA = Number(a.location_id) || 99999;
                var locationB = Number(b.location_id) || 99999;
                var compare = locationA - locationB;
                if (compare) return compare;
                return Number(a.id) - Number(b.id);
            });
            var campaignList = [];
            var lastCampaign = null;
            for (var i = 0; i < IDs.length; i++) {
                var key = IDs[i];
                var campaign = campaigns[key];
                var location_id = campaign.location_id;
                var lastLocation = (lastCampaign && lastCampaign.location_id);
                if (location_id != lastLocation) {
                    var location = $window.LOCATIONS[location_id];
                    var option = document.createElement('option');
                    campaignList.push({
                        id: location.id,
                        name: location.name,
                        isLocation: true
                    });
                }
                campaignList.push(campaign);

                lastCampaign = campaign;
            }
            $scope.campaigns = campaignList;
        };

        $scope.getCampaignClass = function (campaign) {
            if (campaign.side_mission) {
                return (campaign.location_id == 0 ? "heroUpgrade" : "mythic");
            } else if (campaign.isLocation) {
                return "location";
            } else {
                return "";
            }
        };

        $scope.$watch("selections.campaign", function (newValue, oldValue) {
            $scope.selections.mission = '';
        });

        function toArray(object) {
            var ary = [];
            for (var key in object) {
                ary.push(object[key]);
            }
            return ary;
        }
    }
}(angular));
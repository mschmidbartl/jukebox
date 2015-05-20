/** * index.js * * * @author * @date 15.04.15 - 19:27 * @copyright */var chartController;// A $( document ).ready() block.$(document).ready(function () {    chartController = new ChartController();    chartController.init();});ChartController = function () {    this.chartTrends = null;    this.chartTrendsArray = null;    var that = this;    /**     * Init the Chartcontroller     */    this.init = function () {        //Wait for images to load        setTimeout(function () {            $.ajax({url: "data/charttrends.txt", success: function (chartTrendsJSON) {                console.log(chartTrendsJSON)                that.chartTrends = JSON.parse(chartTrendsJSON);                console.dir(that.chartTrends);                that.chartTrendsArray = [];                for (var p in that.chartTrends) {                    if (that.chartTrends.hasOwnProperty(p)) {                        that.chartTrendsArray[that.chartTrends[p].index - 1] = that.chartTrends[p];                    }                }                console.dir(that.chartTrendsArray);                var popularSongList = $("#popularSongList")                $("#loadingPopularSongs").hide();                $("#updatePopularSongs, #popularSongListContainer").show();                for (var i = 0; i < that.chartTrendsArray.length; i++) {                    var song = that.chartTrendsArray[i];                    console.log(song);                    var editSongElement = $('' +                        '<a  class="list-group-item" >' +                        //'<i class="fa fa-fw fa-music"></i><br>' +                        '<span class="badge">' + song.index + '</span>' +                        '<span class="badge ">'+that.song.getTrendString(song)+'</span></span>' +                        '<h4 class="list-group-item-heading">' +                        '<div class="contenteditableInline popularSongName" contenteditable="true">' + song.name + '</div>' +                        '</h4>' +                        '<p class="list-group-item-text">' +                        '<div  class="contenteditableInline popularSongArtist" contenteditable="true">' + song.artist + '</div>' +                        '</p>' +                        '<span class="pull-right">' +                        // '<button class="btn btn-xs btn-info">CCS</button>' +                        '<button class="hideSongButton btn btn-xs btn-'+that.song.getIsHiddenButtonType(song)+'">'+that.song.getIsHiddenString(song)+'</button>' +                        '</span>' +                        '<div style="clear: both;"></div>' +                        '</a>');                    popularSongList.append(editSongElement);                    var onClick = function (editSongElement, song) {                        //Edit Song Name                        editSongElement.find(".popularSongName")[0].addEventListener("input", function () {                            var songKey = song.origArtist + "-" + song.origName + "-" + song.duration;                            that.chartTrends[songKey].name = $(this).text();                            that.chartTrendsArray[that.chartTrends[songKey].index - 1] = that.chartTrends[songKey];                        }, false);                        //Edit Song Artist                        editSongElement.find(".popularSongArtist")[0].addEventListener("input", function () {                            var songKey = song.origArtist + "-" + song.origName + "-" + song.duration;                            that.chartTrends[songKey].artist = $(this).text();                            that.chartTrendsArray[that.chartTrends[songKey].index - 1] = that.chartTrends[songKey];                        }, false);                        //Hide Song                        editSongElement.find(".hideSongButton").click(function () {                            var songKey = song.origArtist + "-" + song.origName + "-" + song.duration;                            if (that.chartTrends[songKey].hidden == undefined)                                that.chartTrends[songKey].hidden = true;                            else                                that.chartTrends[songKey].hidden = !that.chartTrends[songKey].hidden;                            that.chartTrendsArray[that.chartTrends[songKey].index - 1] = that.chartTrends[songKey];                        });                    }                    onClick(editSongElement, song);                }                console.dir(that.chartTrendsArray);            }});        }, 100);        $("#updatePopularSongs").click(function () {            that.updatePopularSong()        });    };    this.updatePopularSong = function () {        $.ajax({            url: "http://h2406563.stratoserver.net:3005/admin/",            method: "POST",            data: {                chartTrendsJSON: JSON.stringify(that.chartTrends)            },            success: function (data) {                alert(data)            },            error: function () {                $('#info').html('<p>An error has occurred</p>');            }        })    }    this.song = {        getTrendString: function (song) {            if (song.trend == 3)                return "New";            else if (song.trend == 0)                return "Winner";            else if (song.trend == 2)                return "Loser";            else                return "Same";        } ,        getIsHiddenString: function (song) {            if (song.hidden == true)                return "Show";            else                return "Hide";        },        getIsHiddenButtonType: function (song) {        if (song.hidden == true)            return "danger";        else            return "warning";    }    }};
﻿'use strict';

var loadDeckDialog;

$(function () {
    $("#deck1").change(function ()
    {
        this.value = this.value.trim();
        deckChanged("attack_deck", hash_decode(this.value));
    });

    $("#deck2").change(function ()
    {
        this.value = this.value.trim();
        deckChanged("defend_deck", hash_decode(this.value));
    });

    function deckChanged(deckID, newDeck) {
        var $deck = $("#" + deckID);
        $deck.children().remove();
        $deck.append(CARD_GUI.makeDeckHTML(newDeck));
    }
    var accordions = $(".accordion").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
    }).filter(".start-open").accordion('option', 'active' , 0);

    $("#raid, #raid_level").change(function () {
        var newDeck;
        var selectedRaid = $("#raid").val();
        var raidlevel = $('#raid_level');
        if (selectedRaid) {
            newDeck = load_deck_raid(selectedRaid, raidlevel.val());
            if (RAIDS[selectedRaid].type === "dungeon") {
                raidlevel.attr("max", 150);
            } else {
                raidlevel.attr("max", 40);
            }
        } else {
            newDeck = hash_decode('');
            raidlevel.attr("max", 40);
        }
        deckChanged("defend_deck", newDeck);
    });

    $("#campaign").change(function () {
        $("#mission").change();
    });

    $("#mission").change(function () {
        var newDeck;
        if (this.value) {
            var missionLevel = document.getElementById('mission_level').value;
            newDeck = load_deck_mission(this.value, missionLevel);
        } else {
            newDeck = hash_decode('');
        }
        deckChanged("defend_deck", newDeck);
    });

    loadDeckDialog = $("#loadDeckDialog").dialog({
        autoOpen: false,
        minWidth: 320,
        /*
        minHeight: 20,
        */
        modal: true,
        resizable: false,
        buttons: {
            Delete: function () {
                var name = $("#loadDeckName").val();
                var newHash = storageAPI.deleteDeck(name);
            },
            Load: function () {
                var name = $("#loadDeckName").val();
                var newHash = storageAPI.loadDeck(name);
                onDeckLoaded(newHash, loadDeckDialog.hashField);
                loadDeckDialog.dialog("close");
            },
            Cancel: function () {
                loadDeckDialog.dialog("close");
            }
        },
    });

    deckChanged("attack_deck", hash_decode(''));
    deckChanged("defend_deck", hash_decode(''));

    // Disable this as we now draw the full deck
    debug_dump_decks = function () { };

    setDeckSortable("#attack_deck", '#deck1');
    setDeckSortable("#defend_deck", '#deck2');
});

function setDeckSortable(deckField, associatedHashField)
{
    $(deckField).sortable({
        items: '.card:not(.commander):not(.blank)',
        tolerance: "intersect",
        helper: function (event, ui)
        {
            return ui.clone();
        },
        start: function (event, ui)
        {
            var origPos = ui.placeholder.index() - 1;
            ui.item.data('origPos', origPos);
            $(ui.item).hide();
        },
        stop: function (event, ui)
        {
            var origPos = ui.item.data('origPos') - 1;
            var newPos = ui.item.index() - 1;
            
            var hashField = $(associatedHashField);
            var deck = hash_decode(hashField.val());
            var array = deck.deck;
            array.splice(newPos, 0, array.splice(origPos, 1)[0]);
            var hash = hash_encode(deck);
            hashField.val(hash);
        }
    });
}

function loadDeck(hashField) {
    var decks = storageAPI.getSavedDecks;
    $('label[for="loadDeckName"]').html('<strong>Deck:</strong>');
    loadDeckDialog.dialog("open");
    loadDeckDialog.dialog("option", "position", { my: "center", at: "center", of: window });

    loadDeckDialog.hashField = hashField;
}

function onDeckLoaded(newHash, hashField)
{
    $(hashField).val(newHash).change();
}

var dark = false;
function toggleTheme() {
    if (dark) {
        $("#theme").attr("href", "styles/sass/themes/light.css")
        $("#toggleTheme").val("Dark Theme");
    } else {
        $("#theme").attr("href", "styles/sass/themes/dark.css")
        $("#toggleTheme").val("Light Theme");
    }
    dark = !dark;
}
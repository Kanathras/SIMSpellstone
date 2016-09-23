"use strict";

var SIM_CONTROLLER = (function () {

    function getConfiguration() {
        sims_left = $('#sims').val() || 1;

        debug = $('#debug').is(':checked');
        mass_debug = $('#mass_debug').is(':checked');
        loss_debug = $('#loss_debug').is(':checked');
        win_debug = $('#win_debug').is(':checked');

        auto_mode = $('#auto_mode').is(':checked');
        getdeck = $('#deck1').val();
        getordered = $('#ordered').is(':checked');
        getexactorder = $('#exactorder').is(':checked');
        getordered2 = $('#ordered2').is(':checked');
        getexactorder2 = $('#exactorder2').is(':checked');
        getdeck2 = $('#deck2').val();
        getordered2 = $('#ordered2').is(':checked');
        getexactorder2 = $('#exactorder2').is(':checked');
        getmission = $('#mission').val();
        getraid = $('#raid').val();
        raidlevel = $('#raid_level').val();
        getsiege = $('#siege').is(':checked');
        surge = $('#surge').is(':checked');
        tower_level = $('#tower_level').val();
        tower_type = $('#tower_type').val();
        if (!getdeck2) {
            if (getmission) {
                getdeck2 = MISSIONS[getmission].hash;
            } else if (getraid) {
                getdeck2 = hash_encode(load_deck_raid(getraid, raidlevel));
            }
        }
        if (BATTLEGROUNDS) {
            getbattleground = getSelectedBattlegrounds();
        }
    }

    // Loops through all simulations
    // - keeps track of number of simulations and outputs status
    function debug_end(result) {

        var result = SIM_CONTROLLER.processSimResult();

        sims_left = 0;
        time_stop = new Date();

        var msg;
        if (result == 'draw') {
            msg = '<br><h1>DRAW</h1><br>';
        } else if (result) {
            msg = '<br><h1>WIN</h1><br>';
        } else {
            msg = '<br><h1>LOSS</h1><br>';
        }
        if (echo) {
            outp(echo);
        }
        setSimStatus(msg);

        showUI();

        if (SIM_CONTROLLER.end_sims_callback) SIM_CONTROLLER.end_sims_callback();
    }

    return {
        getConfiguration: getConfiguration,
        debug_end: debug_end,

        end_sims_callback: null,
        stop_sims_callback: null
    };
})();
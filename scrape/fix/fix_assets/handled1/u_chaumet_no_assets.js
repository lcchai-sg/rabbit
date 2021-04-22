const u = [
    "https://www.chaumet.com/en/bee-my-love-watch-extra-small-model-w16403-46bm",
    "https://www.chaumet.com/en/bee-my-love-watch-extra-small-model-w16503-46am",
    "https://www.chaumet.com/en/bolero-watch-small-model-w83756-001m",
    "https://www.chaumet.com/en/bolero-watch-small-model-w83775-001m",
    "https://www.chaumet.com/en/bolero-watch-small-model-w84500-001m",
    "https://www.chaumet.com/en/bolero-watch-small-model-w84828-001m",
    "https://www.chaumet.com/en/bolero-watch-small-model-w84982-001m",
    "https://www.chaumet.com/en/bolero-watch-small-model-w84988-001m",
    "https://www.chaumet.com/en/class-one-watch-medium-model-w17224-33em",
    "https://www.chaumet.com/en/class-one-watch-medium-model-w1722h-35am",
    "https://www.chaumet.com/en/class-one-watch-medium-model-w1722i-35am",
    "https://www.chaumet.com/en/class-one-watch-medium-model-w17624-35am",
    "https://www.chaumet.com/en/class-one-watch-w1722b-20bm",
    "https://www.chaumet.com/en/class-one-watch-w1722w-20wm",
    "https://www.chaumet.com/en/colombes-creative-complication-w24199-bc3m",
    "https://www.chaumet.com/en/dandy-watch-extra-large-model-w84416-001m",
    "https://www.chaumet.com/en/dandy-watch-large-model-w11288-16bm",
    "https://www.chaumet.com/en/dandy-watch-large-model-w11888-16cm",
    "https://www.chaumet.com/en/dandy-watch-large-model-w83874-001m",
    "https://www.chaumet.com/en/dandy-watch-large-model-w83876-001m",
    "https://www.chaumet.com/en/eclosion-de-chaumet-watch-w84250-001m",
    "https://www.chaumet.com/en/eclosion-de-chaumet-watch-w84251-001m",
    "https://www.chaumet.com/en/eclosion-de-chaumet-watch-w84417-001m",
    "https://www.chaumet.com/en/eclosion-de-chaumet-watch-w84418-001m",
    "https://www.chaumet.com/en/ecritures-de-chaumet-watches-w25120-ca1m",
    "https://www.chaumet.com/en/ecritures-de-chaumet-watches-w25120-ma1m",
    "https://www.chaumet.com/en/ecritures-de-chaumet-watches-w25120-mo1m",
    "https://www.chaumet.com/en/ecritures-de-chaumet-watches-w25820-rd1m",
    "https://www.chaumet.com/en/ecritures-de-chaumet-watches-w25820-rn1m",
    "https://www.chaumet.com/en/ecritures-de-chaumet-watches-w25820-vg1m",
    "https://www.chaumet.com/en/esquisse-de-chaumet-watch-w84249-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-limited-edition-w84253-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-small-model-w20811-11mm",
    "https://www.chaumet.com/en/hortensia-eden-watch-small-model-w20811-11nm",
    "https://www.chaumet.com/en/hortensia-eden-watch-small-model-w20811-11om",
    "https://www.chaumet.com/en/hortensia-eden-watch-small-model-w20811-11tm",
    "https://www.chaumet.com/en/hortensia-eden-watch-w83877-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w83878-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w83879-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w83880-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w83881-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w83885-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w84254-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w84534-001m",
    "https://www.chaumet.com/en/hortensia-eden-watch-w84826-001m",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20611-20bm",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20611-20cm",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20611-20mm",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20611-20pm",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20611-20tm",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20611-20wm",
    "https://www.chaumet.com/en/hortensia-eden-watches-w20811-11gm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13900-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13901-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13902-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13903-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13904-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13905-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13906-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13907-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-imperiale-watch-small-model-w13908-01bm",
    "https://www.chaumet.com/en/josephine-aigrette-timepiece-w85164-001m",
    "https://www.chaumet.com/en/josephine-aigrette-timepiece-w85165-001m",
    "https://www.chaumet.com/en/josephine-aigrette-timepiece-w85166-001m",
    "https://www.chaumet.com/en/josephine-aigrette-timepiece-w85167-001m",
    "https://www.chaumet.com/en/josephine-aigrette-timepiece-w85168-001m",
    "https://www.chaumet.com/en/josephine-rondes-de-nuit-secret-watch-w84755-001m",
    "https://www.chaumet.com/en/josephine-rondes-de-nuit-watch-small-model-w13110-01bm",
    "https://www.chaumet.com/en/josephine-rondes-de-nuit-watch-small-model-w13511-01bm",
    "https://www.chaumet.com/en/laurier-secret-watch-medium-model-w83798-001m",
    "https://www.chaumet.com/en/laurier-secret-watch-medium-model-w84675-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84017-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84045-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84047-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84048-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84049-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84063-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84064-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84206-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84207-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84420-001m",
    "https://www.chaumet.com/en/les-pierres-de-reve-de-chaumet-watch-w84421-001m",
    "https://www.chaumet.com/en/liens-lumiere-medium-model-watch-w23175-31bm",
    "https://www.chaumet.com/en/liens-lumiere-medium-model-watch-w23874-11am",
    "https://www.chaumet.com/en/liens-lumiere-medium-model-watch-w83882-001m",
    "https://www.chaumet.com/en/liens-lumiere-medium-model-watch-w84414-001m",
    "https://www.chaumet.com/en/liens-lumiere-medium-model-watch-w84415-001m",
    "https://www.chaumet.com/en/liens-lumiere-small-model-watch-w23115-30bm",
    "https://www.chaumet.com/en/liens-lumiere-small-model-watch-w83884-001m",
    "https://www.chaumet.com/en/liens-lumiere-watch-w23114-10am",
    "https://www.chaumet.com/en/liens-watch-medium-model-w23174-10am",
];

module.exports = u;
$('.doc-body').scrollNav({
    sections: 'h2',
    subSections: 'h3',
    sectionElem: 'section',
    showHeadline: false,
    headlineText: 'Scroll To',
    showTopLink: false,
    topLinkText: 'Top',
    fixedMargin: 40,
    scrollOffset: 40,
    animated: true,
    speed: 500,
    insertTarget: '#doc-menu',
    insertLocation: 'prependTo',
    arrowKeys: false,
    scrollToHash: true,
    onInit: null,
    onRender: null,
    onDestroy: null
});
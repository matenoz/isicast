'use strict';

// Configuring the Articles module
angular.module('docs').config(['lkGoogleSettingsProvider', function (lkGoogleSettingsProvider) {

    lkGoogleSettingsProvider.configure({
	apiKey   : 'AIzaSyDvqMaFtO-vtJkkLOEPRxwC9CoRaKZFbYc',
	clientId : '217850201622-irb8g1r49hngdhle0p5918d79fidia3h.apps.googleusercontent.com',
	scopes   : ['https://www.googleapis.com/auth/drive'],
	locale   : 'it',
	features : ['MULTISELECT_ENABLED'],
	views    : ['DocsUploadView().setIncludeFolders(true)',
		    'DocsView().setStarred(true)',
		    'DocsView(google.picker.ViewId.FOLDERS).setSelectFolderEnabled(true)']
    });
}]);

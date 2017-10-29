'use strict';

// Internships controller
angular.module('internships').controller('InternshipsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Internships',
  function ($scope, $stateParams, $location, Authentication, Internships) {
    $scope.authentication = Authentication;
          // check if object exists
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };
 
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.page = { type: 'liceo' };
    $scope.setLabel = function(){
      if($scope.page.type === 'liceo'){
        $scope.label = 'label-info';
        $scope.type = 'info';
      }
      else if($scope.page.type === 'manutenzione'){
        $scope.label = 'label-success';
        $scope.type = 'success';
      }
      else if($scope.page.type === 'amministrazione'){
        $scope.label = 'label-danger';
        $scope.type = 'danger';
      }
      else if($scope.page.type === 'servizi'){
        $scope.label = 'label-warning';
        $scope.type = 'warning';
      }
    };
    $scope.partners = [];
    $scope.partner = {};
    $scope.addUpdatePartners = function(){
      angular.forEach($scope.logos, function(image, index){
        $scope.partners.push({ name:$scope.partner.name, logo:image.downloadUrl });
        $scope.logos = [];
        $scope.partner.name = '';
      });
    };
    $scope.addPartners = function(){
      angular.forEach($scope.logos, function(image, index){
        $scope.partners.push({ name:$scope.partner, logo:image.downloadUrl });
        $scope.logos = [];
      });
    };
    $scope.removePartners = function(index){
      $scope.partners.splice(index, 1);
    };
    $scope.removeInternshipPartners = function(index){
      $scope.internship.partners.splice(index, 1);
    };
    $scope.activities = [];
    $scope.addActivities = function(){
      $scope.activities.push({ classe:$scope.classe, activity:$scope.activity, start:$scope.start, end:$scope.end });
      $scope.classe = '';
      $scope.activity = '';
      $scope.start = '';
      $scope.end = '';
    };
    $scope.removeActivities = function(index){
      $scope.activities.splice(index,1);
    };
    $scope.removeInternshipActivities = function(index){
      $scope.internship.activities.splice(index, 1);
    };
    $scope.removeInternshipActivities = function(index){
      $scope.internship.activities.splice(index,1);
    };
    $scope.registers = [];
    $scope.register = {};
    $scope.addRegisters = function(){
      $scope.registers.push({ classe:$scope.register.classe, url:$scope.register.url });
      $scope.register.classe = '';
      $scope.register.url = '';
    };
    $scope.removeRegisters = function(index){
      $scope.registers.splice(index, 1);
    };
    $scope.removeInternshipRegisters = function(index){
      $scope.internship.registers.splice(index,1);
    };
    
    // google picker get image
    $scope.sectionimages = [];
    $scope.pics = [];
    $scope.logos = [];
    $scope.onLoaded = function () {
      console.log('Google Picker loaded!');
    }; 
    $scope.onPickedImages = function (docs) {
      angular.forEach(docs, function (file, index) {
        $scope.sectionimages.push(file);
      });
    };
    $scope.onPickedPartnersLogo = function (docs) {
      angular.forEach(docs, function (file, index) {
        $scope.logos.push(file);
      });
    };
    $scope.onPickedPics = function (docs) {
      angular.forEach(docs, function (file, index) {
        $scope.pics.push(file);
      });
    };
    $scope.onCancel = function () {
      console.log('Google picker close/cancel!');
    };
    $scope.removeFileImg = function(index){
      $scope.sectionimages.splice(index, 1);
    };
    $scope.removeInternshipSectionImg = function(index){
      $scope.internship.sectionimages.splice(index, 1);
    };
    $scope.removeFilePics = function(index){
      $scope.pics.splice(index, 1);
    };
    $scope.removeInternshipPics = function(index){
      $scope.internship.pics.splice(index, 1);
    };
    
    // Create new Internship
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'internshipForm');

        return false;
      }

      // Create new Internship object
      var internship = new Internships({
        page: this.page.type,
        type: this.type,
        title: this.title,
        abstract: this.abstract,
        content: this.content,
        description: this.description,
        activities:[],
        registers: [],
        partners:[],
        sectionimages:[],
        pics:[]	
      });
      angular.forEach($scope.activities, function(activity, index){
        internship.activities.push({ classe:activity.classe, activity:activity.activity, start:activity.start, end:activity.end });
      });
      angular.forEach($scope.registers, function(register,index){
        internship.registers.push({ classe:register.classe, url:register.url });
      });
      angular.forEach($scope.partners, function(partner, index){
        internship.partners.push({ name:partner.name, logo:partner.logo });
      });
      angular.forEach($scope.sectionimages, function(image, index){
        internship.sectionimages.push({ caption:$scope.page.type, link:image.url, url:image.downloadUrl, icon:image.iconUrl, name:image.name });
      });
      angular.forEach($scope.pics, function(pic, index){
        internship.pics.push({ caption:$scope.page.type, link:pic.url, url:pic.downloadUrl, icon:pic.iconUrl, name:pic.name });
      });
      // Redirect after save
      internship.$save(function (response) {
        $location.path('internships/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.abstract = '';
        $scope.content = '';
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Internship
    $scope.remove = function (internship) {
      if (internship) {
        internship.$remove();

        for (var i in $scope.internships) {
          if ($scope.internships[i] === internship) {
            $scope.internships.splice(i, 1);
          }
        }
      } else {
        $scope.internship.$remove(function () {
          $location.path('internships');
        });
      }
    };

    // Update existing Internship
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'internshipForm');

        return false;
      }

      var internship = $scope.internship;
      angular.forEach($scope.activities, function(activity, index){
        internship.activities.push({ classe:activity.classe, activity:activity.activity, start:activity.start, end:activity.end });
      });
      angular.forEach($scope.registers, function(register,index){
        internship.registers.push({ classe:register.classe, url:register.url });
      });
      angular.forEach($scope.partners, function(partner, index){
        internship.partners.push({ name:partner.name, logo:partner.logo });
      });
      angular.forEach($scope.sectionimages, function(image, index){
        internship.sectionimages.push({ caption:$scope.page.type, link:image.url, url:image.downloadUrl, icon:image.iconUrl, name:image.name });
      });
      angular.forEach($scope.pics, function(pic, index){
        internship.pics.push({ caption:$scope.page.type, link:pic.url, url:pic.downloadUrl, icon:pic.iconUrl, name:pic.name });
      });
      
      internship.$update(function () {
        $location.path('internships/' + internship._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Internships
    $scope.find = function () {
      $scope.slides = [];
      $scope.gallery = [];
      $scope.partners = [];
      $scope.activities = [];
      $scope.internships = Internships.query({},function(){
        angular.forEach($scope.internships, function(internship, index){
          angular.forEach(internship.pics, function(pic, index){
            $scope.gallery.push({ image:pic.url });            
          });
          angular.forEach(internship.sectionimages, function(image, index){
            $scope.slides.push({ text:image.caption, image:image.url });
          });
          angular.forEach(internship.activities, function(activity, index){
            $scope.activities.push({ type:internship.type, classe:activity.classe, activity: activity.activity, start:activity.start, end:activity.end });
          });
          angular.forEach(internship.partners, function(partner, index){
            $scope.partners.push({ logo:partner.logo, name:partner.name });
          });
        });
      });
    };

   // Find existing Internship
    $scope.findOne = function () {
      $scope.internships = Internships.query();
      $scope.internship = Internships.get({
        internshipId: $stateParams.internshipId
      });
    };
  }
]);

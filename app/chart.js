app.controller("chartCtrl", function ($scope) {

  $scope.labels = [":10",":20",":30",":40",":50","1:00", "1:10","1:20","1:30"],

  $scope.data = [
    [0.2294462782412093, 0.7575233110696172, -0.3573443110696172, 0.6441003110696172, 0.7570003489696172, 0.4324313110696172, -0.4234003110696172, 0.1570003110696172, -1]
  ];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.onHover = function(points) {
    if (points.length > 0) {
        console.log('Point', points[0].value);
      } else {
        console.log('No point');
      };
  };

// $scope.data.forEach(color);

// function color(data) {
//   if (data < 0) {
//     Chart.defaults.global.colours[0] = "#ff0000"
//   } else {
//     Chart.defaults.global.colours[0] = "#66ff33"
//   }
// }

// Chart.defaults.global.bezierCurve = false;
// Chart.defaults.global.colours[0] = "#ff0000"

$scope.chartOptions = {
  bezierCurve: false
};

console.log(Chart.defaults.global);
});

// var data = {
//     labels: [":10",":20",":30",":40",":50","1:00", "1:10","1:20","1:30"],
//     datasets: [{
//         data: [0.2294462782412093, 0.7575233110696172, null, null, null, null, null, null, null],
//         fillColor: "rgba(151,205,187,0.2)",
//         strokeColor: "rgba(151,205,187,1)",
//         pointColor: "rgba(151,205,187,1)",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "rgba(151,205,187,1)",
//     }, {
//         data: [null, 0.7575233110696172, -0.3573443110696172, null ,null, null, null ,null, null],
//         fillColor: "rgba(205,151,187,0.2)",
//         strokeColor: "rgba(205,151,187,1)",
//         pointColor: "rgba(205,151,187,1)",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "rgba(205,151,187,1)",
//     }, {
//         data: [null, null, -0.3573443110696172, 0.6441003110696172 ,0.7570003489696172, null, null ,null, null],
//         fillColor: "rgba(151,205,187,0.2)",
//         strokeColor: "rgba(151,205,187,1)",
//         pointColor: "rgba(151,205,187,1)",
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "rgba(151,205,187,1)",
//     }
//     ]
// };

// var ctx = document.getElementById("line").getContext("2d");
// var options = {
//    showTooltips: false,
//    datasetFill: true,
// }

// var chart = new Chart(ctx).Line(data, options);
// });
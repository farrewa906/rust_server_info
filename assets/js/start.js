function hidePreloader(){
	$('#preloader').animate(
		{
			opacity: "0"
		}, 
		{
			duration: 1000,
			complete: function() {
				$(this).hide();
				$('body').css('overflow', 'visible');
				/* ------------------------------------------------------ */
				window.myChart = new Chart(document.getElementById("doughnut-chart"), {
				    type: 'doughnut',
				    data: {
				      labels: ["Онлайн", "Спящие", "Свободные слоты"],
				      datasets: [
				        {
				          label: "Population (millions)",
				          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
				          data: [0,0,0]
				        }
				      ]
				    },
				    options: {
				      title: {
				        display: true,
				        text: 'Онлайн -- / -- ( -- спящие )'
				      }
				    }
				});
				/* ------------------------------------------------------ */
				var adr = getUrlParameter('adr');
				if (typeof adr !== "undefined") {
					connect(adr);
					$('input[name="adr"]').val(adr);
					updateInfo(adr);
					setInterval(updateInfo, 60000, adr);
				}
				/* ------------------------------------------------------ */

			},
		}
	);
	
}
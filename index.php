<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="assets/css/bootstrap.css">
	<link rel="stylesheet" href="assets/css/custom.min.css">
	<link rel="stylesheet" href="assets/css/style.css">
</head>

<body onload="hidePreloader();">
	<div id="preloader">
		<i class="fa fa-cog fa-spin" aria-hidden="true"></i>
	</div>

	<div class="container" style="margin-top:10px;">
		<?php $start = microtime(true); ?> 

		<div class="row">
			<div class="col-sm-12">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Настройка подключения</h3>
					</div>
					<div class="panel-body">
						<div class="row">
							<div class="col-sm-12">
								<form method="GET">
									<div class="input-group">
										<span class="input-group-addon">IP</span>
										<input type="text" name="adr" class="form-control">
										<span class="input-group-btn">
											<button class="btn btn-danger" type="reset">СБРОС</button>
										</span>
										<span class="input-group-btn">
											<button class="btn btn-default" type="submit">СОЕДИНИТЬСЯ</button>
										</span>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>			
			</div>
		</div>
	


		<div class="row">
			<div class="col-sm-12">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Название сервера</h3>
					</div>
					<div class="panel-body">
						<h2 id="sname">Server Name long name server name</h2>
					</div>
				</div>		
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12 col-md-6">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Онлайн</h3>
					</div>
					<div class="panel-body">
						<canvas id="doughnut-chart" width="300" height="300"></canvas>
					</div>
				</div>	
				<!-- -->	
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Параметры карты и сервера</h3>
					</div>
					<div class="panel-body">
						<table class="table table-striped table-hover ">
							<thead>
								<tr>
								  <th>Параметр</th>
								  <th>Значение</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Тип карты</td>
									<td id="level">---</td>
								</tr>
								<tr>
									<td>Размер карты</td>
									<td id="size">---</td>
								</tr>
								<tr>
									<td>Ключ генерации карты</td>
									<td id="seed">---</td>
								</tr>
								<tr>
									<td>Время на сервере</td>
									<td id="time">---</td>
								</tr>
								<tr>
									<td>Версия клиента</td>
									<td id="vers">---</td>
								</tr>
								<tr>
									<td>Плагин сервера</td>
									<td>Oxide</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!-- -->	
				<!-- -->	
			</div>
			<div class="col-sm-12 col-md-6">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Чат сервера</h3>
					</div>
					<div class="panel-body">
						<div class="row">
							<div id="chat" class="col-sm-12">
																
							</div>
						</div>
					</div>
				</div>	
				<!-- -->
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Список игроков</h3>
					</div>
					<div class="panel-body" id="players-wrap">
						<div class="row" id="playersList">
							<div class="col-sm-12">
								<div class="alert alert-dismissible alert-warning">
									<button type="button" class="close" data-dismiss="alert">&times;</button>
									<h4>Предупреждение</h4>
									<p>На данном сервере нет игроков онлайн.</p>
								</div>									
							</div>
						</div>
					</div>
				</div>	
				<!-- -->		
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">Карта сервера</h3>
					</div>
					<div class="panel-body">
						<div id="map-wr">
							<img src="" id="map" style="width: 100%">
						</div>
					</div>
				</div>		
			</div>

		</div>

	</div>










	

	<script src="assets/js/jquery-1.10.2.min.js"></script>
	<script src="assets/js/main.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
	<script src="assets/js/custom.js"></script>
	<script src="https://use.fontawesome.com/4011bc9f1b.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
	
	<script src="assets/js/start.js"></script>

</body>
</html>
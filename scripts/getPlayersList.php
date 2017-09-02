
<?php if ( !empty($_GET['adr']) ): ?>
	<?php 

	include_once($_SERVER['DOCUMENT_ROOT'] . '/rust/scripts/' . 'function.php');

	$adr = $_GET['adr']; 
	$adr = explode(':', $adr);

	$sinfo = get_server_info($adr[0], $adr[1]);

	$players = array_slice($sinfo['recent'], 0, $sinfo['status']['players']);

	?>
	<?php if ( count($players) == 0 ): ?>
		<div class="col-sm-12">
			<div class="alert alert-dismissible alert-warning">
				<button type="button" class="close" data-dismiss="alert">&times;</button>
				<h4>Предупреждение</h4>
				<p>На данном сервере нет игроков онлайн.</p>
			</div>									
		</div>
	<? else: ?>
		<? foreach ($players as $key => $player): ?>
			<div class="col-sm-12 col-md-6 col-lg-4">
				<a id="player-<?=$player['id']?>" class="player block" href="http://steamcommunity.com/profiles/<?=$player['id']?>/">
					<img src="http://185.159.128.118/rust/scripts/getPlayersAvatar.php?steamID=<?=$player['id']?>">
					<div class="name"><?= $player['name'] ?></div>
				</a>
			</div>
		<? endforeach; ?>
		<script>
		$('.name').width($('.player').width() - 32 - 5);
		$(window).resize(function(){
			$('.name').width($('.player').width() - 32 - 5);
		});
		</script>
	<?php endif ?>
<?php else: ?>
	<div class="col-sm-12">
		<div class="alert alert-dismissible alert-danger">
			<button type="button" class="close" data-dismiss="alert">&times;</button>
			<h4>Ошибка</h4>
			<p>Не возможнополучить список игроков.</p>
		</div>									
	</div>
<?php endif ?>




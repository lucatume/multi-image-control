<div class="customize-control-content">
	<ul class="thumbnails">
		<?php if ( is_array( $srcs ) ): ?>
			<?php foreach ( $srcs as $src ): ?>
				<?php if ( $src != '' ): ?>
					<li class="thumbnail" style="background-image: url(<?php echo $src; ?>);"
					    data-src="<?php echo $src; ?>">
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		<?php endif; ?>
	</ul>
</div>

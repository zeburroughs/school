<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title><?php echo CMS::$Config['website.name'].' '.$this->Title; ?></title>
  </head>
  <body class="<?php echo $this->Body['class']; ?>" id="<?php $this->Body['id']; ?>">
    <p>
    <?php echo implode($this->CSS);?>
    <?php echo implode($this->JS); ?>
    <?php echo $this->Favicon; ?>
    <?php echo $this->HeadData; ?>
    <?php echo $this->Body ?>
    </p>
    <p><?php Body['content']; ?></p>
  </body>
  </html>

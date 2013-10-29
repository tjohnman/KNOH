#include "Controller.h"

Controller::Controller(unsigned int width, unsigned int height) : _m_Width(width), _m_Height(height), _m_GridWidth(width/16), _m_GridHeight(height/16-2)
{
	_m_ImgMetal.loadFromFile("gfx/Metal.png");
	_m_ImgPSilicon.loadFromFile("gfx/PSilicon.png");
	_m_ImgNSilicon.loadFromFile("gfx/NSilicon.png");
	_m_ImgVia.loadFromFile("gfx/Via.png");
	_m_ImgGrid.loadFromFile("gfx/Grid.png");
	_m_ImgHigh.loadFromFile("gfx/High.png");

	_m_KNOH.loadFromFile("gfx/KNOH.png");
	
	_m_Grid[0] = new _t_cell[width*height/256];
	_m_Grid[1] = new _t_cell[width*height/256];
	_m_ViaGrid = new bool[width*height/256];
	for(unsigned int i=0; i<width*height/256; ++i) _m_ViaGrid[i] = false;

	_m_Canvas.create(width, height);
	_m_CanvasSprite.setTexture(_m_Canvas.getTexture());

	_m_GridCanvas.create(width, height);
	_m_GridCanvasSprite.setTexture(_m_GridCanvas.getTexture());
	
	_m_ObjectCanvas.create(width, height);
	_m_ObjectCanvasSprite.setTexture(_m_ObjectCanvas.getTexture());

	sf::Sprite sprite;
	sf::Sprite logoSprite;
	logoSprite.setTexture(_m_KNOH);
	
	_m_GridCanvas.clear();

	sprite.setTexture(_m_ImgGrid);
	for(unsigned int x=0; x<width/16; ++x)
	{
		for(unsigned int y=0; y<height/16-2; ++y)
		{
			sprite.setPosition((float)x*16, (float)y*16);
			_m_GridCanvas.draw(sprite);
		}
	}

	sprite.setTexture(_m_KNOH);
	sprite.setTextureRect(sf::IntRect(0, 0, 128, 32));
	sprite.setColor(sf::Color(255, 255, 255, 60));
	sprite.setPosition(_m_Width/2 - 64, _m_Height/2 - 32);
	_m_GridCanvas.draw(sprite);

	_m_GridCanvas.display();

	_m_ObjectCanvas.clear(sf::Color(0, 0, 0, 0));
	
	sprite.setColor(sf::Color(255, 255, 255, 255));
	sprite.setTexture(_m_ImgHigh);
	sprite.setTextureRect(sf::IntRect(0, 0, 48, 48));
	sprite.setPosition(16, 16);
	_m_ObjectCanvas.draw(sprite);

	sprite.setPosition(_m_Width-64, 16);
	_m_ObjectCanvas.draw(sprite);

	sprite.setPosition(((_m_Width-64)/16)*16, ((_m_Height-96)/16)*16);
	_m_ObjectCanvas.draw(sprite);

	sprite.setPosition(16, ((_m_Height-96)/16)*16);
	_m_ObjectCanvas.draw(sprite);

	_m_ObjectCanvas.display();

	_m_BrushIndex = 1;
	_m_CurrentBrush.material = 'm';

	_m_MouseLeftIsDown = false;
	_m_MouseRightIsDown = false;
}

Controller::~Controller()
{
	delete[] _m_Grid[0];
	delete[] _m_Grid[1];
	delete[] _m_ViaGrid;
}

void Controller::draw(sf::RenderWindow * window)
{
	window->draw(_m_GridCanvasSprite);
	window->draw(_m_CanvasSprite);
	window->draw(_m_ObjectCanvasSprite);
}

void Controller::redrawCanvas()
{
	_m_Canvas.clear(sf::Color(0, 0, 0, 0));

	for(unsigned int g=0; g<2; ++g)
	{
		for(unsigned int i=0; i<_m_GridWidth*_m_GridHeight; ++i)
		{
			unsigned int gridx = i%_m_GridWidth;
			unsigned int gridy = i/_m_GridWidth;
			_t_cell * cell = _getCellAt(g, gridx, gridy);

			if(!cell) continue;

			sf::Sprite drawSprite;

			unsigned int x = gridx*16;
			unsigned int y = gridy*16;

			unsigned int rx, ry, rw, rh, incSize;

			if(cell->material)
			{
				switch(cell->material)
				{
				default:
				case 'm':
					rx = 2; ry = 2; rw = 12; rh = 12; incSize = 2;
					drawSprite.setTexture(_m_ImgMetal);
					break;
				case 'n':
					rx = 4; ry = 4; rw = 8; rh = 8; incSize = 4;
					drawSprite.setTexture(_m_ImgNSilicon);
					break;
				case 'p':
					rx = 4; ry = 4; rw = 8; rh = 8; incSize = 4;
					drawSprite.setTexture(_m_ImgPSilicon);
					break;
				}

				if(cell->north)
				{
					ry = 0;
					rh += incSize;
				}
				if(cell->south)
				{
					rh += incSize;
				}
				if(cell->west)
				{
					rx = 0;
					rw += incSize;
				}
				if(cell->east)
				{
					rw += incSize;
				}
				drawSprite.setTextureRect(sf::IntRect(rx, ry, rw, rh));
				drawSprite.setPosition((float)(x+rx), (float)(y+ry));

				_m_Canvas.draw(drawSprite);
			}
		}
	}

	_m_Canvas.display();
}

void Controller::update(float delta)
{
	unsigned int gridX = m_MousePosition.x/16;
	unsigned int gridY = m_MousePosition.y/16;

	unsigned int g;
	if(_m_CurrentBrush.material == 'm') g = 0; else g = 1;

	if(_m_MouseLeftIsDown)
	{
		if(_getCellAt(g, gridX, gridY))
		{
			if(_getCellAt(g, gridX, gridY)->material == 0)
			{
				_setCellAt(g, gridX, gridY, &_m_CurrentBrush, false);
			}

			unsigned int relx = m_MousePosition.x - (m_MousePosition.x/16)*16;
			unsigned int rely = m_MousePosition.y - (m_MousePosition.y/16)*16;

			if(_getCellAt(g, gridX-1, gridY) && gridX > 0 && relx < 4 && _getCellAt(g, gridX-1, gridY)->material)
			{
				_getCellAt(g, gridX-1, gridY)->east = true;
				_getCellAt(g, gridX, gridY)->west = true;
			}
			if(_getCellAt(g, gridX+1, gridY) && gridX < _m_GridWidth && relx >= 12 && _getCellAt(g, gridX+1, gridY)->material)
			{
				_getCellAt(g, gridX+1, gridY)->west = true;
				_getCellAt(g, gridX, gridY)->east = true;
			}
			if(_getCellAt(g, gridX, gridY-1) && gridY > 0 && rely < 4 && _getCellAt(g, gridX, gridY-1)->material)
			{
				_getCellAt(g, gridX, gridY-1)->south = true;
				_getCellAt(g, gridX, gridY)->north = true;
			}
			if(_getCellAt(g, gridX, gridY+1) && gridY < _m_GridWidth && rely >= 12 && _getCellAt(g, gridX, gridY+1)->material)
			{
				_getCellAt(g, gridX, gridY+1)->north = true;
				_getCellAt(g, gridX, gridY)->south = true;
			}
			redrawCanvas();
		}
	}
	if(_m_MouseRightIsDown)
	{
		if(_getCellAt(g, gridX, gridY))
		{
			_setCellAt(g, gridX, gridY, NULL);
			redrawCanvas();
		}
	}
}

bool Controller::_setCellAt(unsigned int layer, unsigned int x, unsigned int y, _t_cell * cell, bool copyConnections)
{
	if(x >= _m_GridWidth || y >= _m_GridHeight) return false;

	if(cell)
	{
		_getCellAt(layer, x, y)->copyFrom(cell, copyConnections);
	}
	else
	{
		_getCellAt(layer, x, y)->clear();
		if(x > 0) _getCellAt(layer, x-1, y)->east = false;
		if(x < _m_GridWidth) _getCellAt(layer, x+1, y)->west = false;
		if(y > 0) _getCellAt(layer, x, y-1)->south = false;
		if(y < _m_GridHeight) _getCellAt(layer, x, y+1)->north = false;
	}

	return true;
}

Controller::_t_cell * Controller::_getCellAt(unsigned int layer, unsigned int x, unsigned int y)
{
	if(x >= _m_GridWidth || y >= _m_GridHeight) return NULL;
	return &_m_Grid[layer][x+y*_m_GridWidth];
}

void Controller::onKeyPressed(sf::Event::KeyEvent event)
{
	switch(event.code)
	{
	case sf::Keyboard::Num1:
		_m_BrushIndex = 1;
		_m_CurrentBrush.material = 'm';
		break;
	case sf::Keyboard::Num2:
		_m_BrushIndex = 2;
		_m_CurrentBrush.material = 'n';
		break;
	case sf::Keyboard::Num3:
		_m_BrushIndex = 3;
		_m_CurrentBrush.material = 'p';
		break;
	case sf::Keyboard::Num4:
		_m_BrushIndex = 4;
		break;
	default:
		break;
	}
}

void Controller::onKeyReleased(sf::Event::KeyEvent event)
{

}

void Controller::onMouseDown(sf::Event::MouseButtonEvent event)
{
	if(event.button == sf::Mouse::Left) _m_MouseLeftIsDown = true;
	if(event.button == sf::Mouse::Right) _m_MouseRightIsDown = true;
}

void Controller::onMouseUp(sf::Event::MouseButtonEvent event)
{
	if(event.button == sf::Mouse::Left) _m_MouseLeftIsDown = false;
	if(event.button == sf::Mouse::Right) _m_MouseRightIsDown = false;
}

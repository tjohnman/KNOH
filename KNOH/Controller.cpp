#include "Controller.h"

Controller::Controller(unsigned int width, unsigned int height) : _m_Width(width), _m_Height(height), _m_GridWidth(width/16), _m_GridHeight(height/16-2)
{
	// Load assets
	_m_ImgMetal.loadFromFile("gfx/Metal.png");
	_m_ImgPSilicon.loadFromFile("gfx/PSilicon.png");
	_m_ImgNSilicon.loadFromFile("gfx/NSilicon.png");
	_m_ImgVia.loadFromFile("gfx/Via.png");
	_m_ImgGrid.loadFromFile("gfx/Grid.png");
	_m_ImgHigh.loadFromFile("gfx/High.png");
	_m_ImgA.loadFromFile("gfx/A.png");
	_m_ImgB.loadFromFile("gfx/B.png");
	_m_ImgC.loadFromFile("gfx/C.png");
	_m_ImgD.loadFromFile("gfx/D.png");
	_m_ImgKNOH.loadFromFile("gfx/KNOH.png");
	_m_DefaultFont.loadFromFile("gfx/OpenSans-Regular.ttf");
}

void Controller::init()
{
	// Draw help text
	_m_HelpText.setFont(_m_DefaultFont);
	_m_HelpText.setString("1. Metal 2. N-Silicon 3. P-Silicon 4. Via | Use left mouse to paint, right mouse to erase. | Tab toggles testing panel.");
	_m_HelpText.setPosition(10.f, (float)_m_Height-26.f);
	_m_HelpText.setColor(sf::Color::White);
	_m_HelpText.setCharacterSize(12);

	// Initialize layers
	_m_Grid[0] = new t_cell[_m_Width*_m_Height/256];
	_m_Grid[1] = new t_cell[_m_Width*_m_Height/256];
	_m_ViaGrid = new bool[_m_Width*_m_Height/256];
	for(unsigned int i=0; i<_m_Width*_m_Height/256; ++i) _m_ViaGrid[i] = false;

	_m_Canvas.create(_m_Width, _m_Height);
	_m_CanvasSprite.setTexture(_m_Canvas.getTexture());

	_m_GridCanvas.create(_m_Width, _m_Height);
	_m_GridCanvasSprite.setTexture(_m_GridCanvas.getTexture());
	
	_m_ObjectCanvas.create(_m_Width, _m_Height);
	_m_ObjectCanvasSprite.setTexture(_m_ObjectCanvas.getTexture());
		
	// Draw grid
	_m_GridCanvas.clear();

	_m_HelperSprite.setTexture(_m_ImgGrid);
	_m_HelperSprite.setTextureRect(sf::IntRect(0, 0, 16, 16));
	for(unsigned int x=0; x<_m_GridWidth; ++x)
	{
		for(unsigned int y=0; y<_m_GridHeight; ++y)
		{
			_m_HelperSprite.setPosition((float)x*16, (float)y*16);
			_m_GridCanvas.draw(_m_HelperSprite);
		}
	}

	// Draw pins
	_drawDecoration(&_m_GridCanvas, _m_ImgKNOH, _m_Width/2 - 64, _m_Height/2 - 64, 60);

	_m_GridCanvas.display();

	_m_ObjectCanvas.clear(sf::Color(0, 0, 0, 0));
	
	_drawDecoration(&_m_ObjectCanvas, _m_ImgHigh, 16, 16);
	_drawDecoration(&_m_ObjectCanvas, _m_ImgHigh, _m_Width-64, 16);
	
	_drawDecoration(&_m_ObjectCanvas, _m_ImgA, 16, 80);
	_drawDecoration(&_m_ObjectCanvas, _m_ImgA, _m_Width-64, 80);
	
	_drawDecoration(&_m_ObjectCanvas, _m_ImgB, 16, 144);
	_drawDecoration(&_m_ObjectCanvas, _m_ImgB, _m_Width-64, 144);
	
	_drawDecoration(&_m_ObjectCanvas, _m_ImgC, 16, 208);
	_drawDecoration(&_m_ObjectCanvas, _m_ImgC, _m_Width-64, 208);
	
	_drawDecoration(&_m_ObjectCanvas, _m_ImgD, 16, 272);
	_drawDecoration(&_m_ObjectCanvas, _m_ImgD, _m_Width-64, 272);

	_m_ObjectCanvas.display();

	_m_BrushIndex = 1;
	_m_CurrentBrush.material = 'm';

	_m_MouseLeftIsDown = false;
	_m_MouseRightIsDown = false;
}

void Controller::_drawDecoration(sf::RenderTexture * canvas, const sf::Texture &texture, unsigned int x, unsigned int y, unsigned char alpha)
{
	_m_HelperSprite.setTexture(texture);
	_m_HelperSprite.setTextureRect(sf::IntRect(0, 0, texture.getSize().x, texture.getSize().y));
	_m_HelperSprite.setColor(sf::Color(255, 255, 255, alpha));
	_m_HelperSprite.setPosition((float)x, (float)y);
	canvas->draw(_m_HelperSprite);
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
	window->draw(_m_HelpText);
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
			t_cell * cell = getCellAt(g, gridx, gridy);

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

	for(unsigned int i=0; i<_m_GridWidth*_m_GridHeight; ++i)
	{
		if(_m_ViaGrid[i])
		{
			sf::Sprite drawSprite;
			drawSprite.setTexture(_m_ImgVia);
			drawSprite.setPosition((i%_m_GridWidth)*16, (i/_m_GridWidth)*16);
			_m_Canvas.draw(drawSprite);
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
		if(getCellAt(g, gridX, gridY))
		{
			if(_m_BrushIndex != 4)
			{
				// Place materials
				if(getCellAt(g, gridX, gridY)->material == 0)
				{
					_setCellAt(g, gridX, gridY, &_m_CurrentBrush, false);
				}

				unsigned int relx = m_MousePosition.x - (m_MousePosition.x/16)*16;
				unsigned int rely = m_MousePosition.y - (m_MousePosition.y/16)*16;

				if(getCellAt(g, gridX-1, gridY) && gridX > 0 && relx < 4 && getCellAt(g, gridX-1, gridY)->material)
				{
					getCellAt(g, gridX-1, gridY)->east = true;
					getCellAt(g, gridX, gridY)->west = true;
				}
				if(getCellAt(g, gridX+1, gridY) && gridX < _m_GridWidth && relx >= 12 && getCellAt(g, gridX+1, gridY)->material)
				{
					getCellAt(g, gridX+1, gridY)->west = true;
					getCellAt(g, gridX, gridY)->east = true;
				}
				if(getCellAt(g, gridX, gridY-1) && gridY > 0 && rely < 4 && getCellAt(g, gridX, gridY-1)->material)
				{
					getCellAt(g, gridX, gridY-1)->south = true;
					getCellAt(g, gridX, gridY)->north = true;
				}
				if(getCellAt(g, gridX, gridY+1) && gridY < _m_GridWidth && rely >= 12 && getCellAt(g, gridX, gridY+1)->material)
				{
					getCellAt(g, gridX, gridY+1)->north = true;
					getCellAt(g, gridX, gridY)->south = true;
				}
			}
			// Place vias
			else if(gridX < _m_GridWidth && gridY < _m_GridHeight)
			{
				t_cell * metal = getCellAt(0, gridX, gridY);
				t_cell * silicon = getCellAt(1, gridX, gridY);

				if(metal && silicon && metal->material == 'm' && silicon->material)
				{
					_m_ViaGrid[gridX + gridY*_m_GridWidth] = true;
				}
			}
			redrawCanvas();
		}
	}
	if(_m_MouseRightIsDown)
	{
		if(getCellAt(g, gridX, gridY))
		{
			if(_m_BrushIndex != 4)
			{
				_setCellAt(g, gridX, gridY, NULL);
			}
			
			_m_ViaGrid[gridX + gridY*_m_GridWidth] = false;
			
			redrawCanvas();
		}
	}
}

bool Controller::_setCellAt(unsigned int layer, unsigned int x, unsigned int y, t_cell * cell, bool copyConnections)
{
	if(x >= _m_GridWidth || y >= _m_GridHeight) return false;

	if(cell)
	{
		getCellAt(layer, x, y)->copyFrom(cell, copyConnections);
	}
	else
	{
		getCellAt(layer, x, y)->clear();
		if(x > 0) getCellAt(layer, x-1, y)->east = false;
		if(x < _m_GridWidth) getCellAt(layer, x+1, y)->west = false;
		if(y > 0) getCellAt(layer, x, y-1)->south = false;
		if(y < _m_GridHeight) getCellAt(layer, x, y+1)->north = false;
	}

	return true;
}

Controller::t_cell * Controller::getCellAt(unsigned int layer, unsigned int x, unsigned int y)
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

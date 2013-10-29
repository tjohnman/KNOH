#ifndef CONTROLLER_H
#define CONTROLLER_H

#include "includes.h"

class Controller
{
public:
	Controller(unsigned int width, unsigned int height);
	~Controller();

	void onKeyPressed(sf::Event::KeyEvent event);
	void onKeyReleased(sf::Event::KeyEvent event);
	void onMouseDown(sf::Event::MouseButtonEvent event);
	void onMouseUp(sf::Event::MouseButtonEvent event);

	void draw(sf::RenderWindow * window);
	void redrawCanvas();
	void update(float delta);

	sf::Vector2i m_MousePosition;

private:
	struct _t_cell
	{
		bool metal;
		bool north, east, south, west;
		unsigned char material;

		_t_cell::_t_cell()
		{
			metal = false;
			north = false;
			east = false;
			south = false;
			west = false;
			material = 0;
		}

		void _t_cell::copyFrom(const _t_cell * other, bool copyConnections = false)
		{
			if(copyConnections)
			{
				north = other->north;
				east = other->east;
				south = other->south;
				west = other->west;
			}
			material = other->material;
		}

		void _t_cell::clear()
		{
			north = false;
			east = false;
			south = false;
			west = false;
			material = 0;
		}
	};

	bool _m_MouseLeftIsDown, _m_MouseRightIsDown;

	_t_cell * _m_Grid[2];
	bool * _m_ViaGrid;
	_t_cell _m_CurrentBrush;
	unsigned int _m_BrushIndex;

	unsigned int _m_Width, _m_Height, _m_GridWidth, _m_GridHeight;

	sf::RenderTexture _m_Canvas, _m_GridCanvas, _m_ObjectCanvas;
	sf::Sprite _m_CanvasSprite, _m_GridCanvasSprite, _m_ObjectCanvasSprite;
	sf::Texture _m_ImgMetal, _m_ImgPSilicon, _m_ImgNSilicon, _m_ImgVia, _m_ImgGrid, _m_ImgHigh;
	sf::Texture _m_KNOH;

	_t_cell * _getCellAt(unsigned int layer, unsigned int x, unsigned int y);
	bool _setCellAt(unsigned int layer, unsigned int x, unsigned int y, _t_cell * cell, bool copyConnections = false);
};

#endif
#ifndef CONTROLLER_H
#define CONTROLLER_H

#include "includes.h"

class Simulator;

class Controller
{
public:
	Controller(unsigned int width, unsigned int height);
	~Controller();

	struct t_cell
	{
		bool high;
		bool north, east, south, west;
		unsigned char material;

		t_cell::t_cell()
		{
			north = false;
			east = false;
			south = false;
			west = false;
			high = false;
			material = 0;
		}

		void t_cell::copyFrom(const t_cell * other, bool copyConnections = false)
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

		void t_cell::clear()
		{
			north = false;
			east = false;
			south = false;
			west = false;
			high = false;
			material = 0;
		}
	};

	void onKeyPressed(sf::Event::KeyEvent event);
	void onKeyReleased(sf::Event::KeyEvent event);
	void onMouseDown(sf::Event::MouseButtonEvent event);
	void onMouseUp(sf::Event::MouseButtonEvent event);

	void init();

	void draw(sf::RenderWindow * window);
	void redrawCanvas();
	void update(float delta);

	sf::Vector2u getGridSize();

	t_cell * getCellAt(unsigned int layer, unsigned int x, unsigned int y);
	bool hasVia(unsigned int x, unsigned int y);

	sf::Vector2i m_MousePosition;

private:

	bool _m_MouseLeftIsDown, _m_MouseRightIsDown;

	t_cell * _m_Grid[2];
	bool * _m_ViaGrid;
	t_cell _m_CurrentBrush;
	unsigned int _m_BrushIndex;

	unsigned int _m_Width, _m_Height, _m_GridWidth, _m_GridHeight;

	sf::RenderTexture _m_Canvas, _m_GridCanvas, _m_ObjectCanvas;
	sf::Sprite _m_CanvasSprite, _m_GridCanvasSprite, _m_ObjectCanvasSprite;
	sf::Sprite _m_HelperSprite;
	sf::Texture _m_ImgMetal, _m_ImgPSilicon, _m_ImgNSilicon, _m_ImgVia, _m_ImgGrid;
	sf::Texture _m_ImgA, _m_ImgB, _m_ImgC, _m_ImgD, _m_ImgHigh;
	sf::Texture _m_ImgKNOH;
	sf::Font _m_DefaultFont;
	sf::Text _m_HelpText;

	Simulator * _m_Simulator;

	bool _isInline(unsigned int layer, unsigned int x, unsigned int y);

	bool _setCellAt(unsigned int layer, unsigned int x, unsigned int y, t_cell * cell, bool copyConnections = false);

	void _drawDecoration(sf::RenderTexture * canvas, const sf::Texture &texture, unsigned int x, unsigned int y, unsigned char alpha = 255);
};

#endif
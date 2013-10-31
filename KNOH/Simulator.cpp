#include "Simulator.h"
#include "Controller.h"

Simulator::Simulator(Controller * c) : _m_Controller(c)
{
	m_Running = false;
}

Simulator::~Simulator()
{

}

void Simulator::update(float delta)
{
	if(m_Running && _m_Clock.getElapsedTime().asMilliseconds() >= 100)
	{
		_m_Clock.restart();

		sf::Vector2u gridSize = _m_Controller->getGridSize();

		// Schedule gates for firing
		for(unsigned int i=0; i<gridSize.x*gridSize.y; ++i)
		{
			unsigned int x = i%gridSize.x;
			unsigned int y = i/gridSize.x;

			Controller::t_cell * cell = _m_Controller->getCellAt(1, x, y);
			if(cell && cell->material)
			{
				// Don't re-schedule if already fired
				if(cell->high) continue;

				// Determine input
				Controller::t_cell * north = NULL, * east = NULL, * south = NULL, * west = NULL, * metal = NULL;
				if(cell->north) north = _m_Controller->getCellAt(1, x, y-1);
				if(cell->east) east = _m_Controller->getCellAt(1, x+1, y);
				if(cell->south) south = _m_Controller->getCellAt(1, x, y+1);
				if(cell->west) west = _m_Controller->getCellAt(1, x-1, y);
				if(_m_Controller->hasVia(x, y)) metal = _m_Controller->getCellAt(0, x, y);

				bool input = (north && north->material == cell->material && north->high) || 
					(east && east->material == cell->material && east->high) || 
					(south && south->material == cell->material && south->high) || 
					(west && west->material == cell->material && west->high) || 
					(metal && metal->material && metal->high);

				// Determine if gate
				unsigned char gateMaterial = (cell->material == 'n' ? 'p' : 'n');
				bool isActive = (north && north->material == gateMaterial && north->high) ||
					(east && east->material == gateMaterial && east->high) ||
					(south && south->material == gateMaterial && south->high) ||
					(west && west->material == gateMaterial && west->high);

				if(!isActive) continue;

				// Schedule gate for propagation phase
				if(cell->material == 'p') _m_activePNPGates.push_back(cell);
				else if(cell->material == 'n') _m_activeNPNGates.push_back(cell);
			}
		}

		// Reset grid state
		for(unsigned int i=0; i<gridSize.x*gridSize.y; ++i)
		{
			Controller::t_cell * cell = _m_Controller->getCellAt(0, i%gridSize.x, i/gridSize.y);
			if(cell && cell->material)
			{
				cell->high = false;
			}

			cell = _m_Controller->getCellAt(1, i%gridSize.x, i/gridSize.y);
			if(cell && cell->material)
			{
				cell->high = false;
			}
		}

		// High pins
	}
}

void Simulator::_propagate(unsigned int layer, unsigned int x, unsigned int y)
{
	Controller::t_cell * cell;

	// Metal layer
	cell = _m_Controller->getCellAt(layer, x, y);
	if(cell && cell->material)
	{
		Controller::t_cell * north = NULL, * east = NULL, * south = NULL, * west = NULL, * via = NULL;
		if(cell->material == 'p')
		{
			cell->high = true;
			for(unsigned int j=0; j<_m_activePNPGates.size(); ++j)
			{
				if(_m_activePNPGates[j] == via)
				{
					cell->high = false;
					break;
				}
			}
		}
		else if(cell->material == 'n')
		{
			cell->high = false;
			for(unsigned int j=0; j<_m_activeNPNGates.size(); ++j)
			{
				if(_m_activeNPNGates[j] == via)
				{
					cell->high = true;
					break;
				}
			}
		}
		else
			cell->high = true;

		// If we are gated and did not activate, propagation ends here
		if(!cell->high) return;

		// Get outputs
		if(cell->north) north = _m_Controller->getCellAt(layer, x, y-1);
		if(cell->east) east = _m_Controller->getCellAt(layer, x+1, y);
		if(cell->south) south = _m_Controller->getCellAt(layer, x, y+1);
		if(cell->west) west = _m_Controller->getCellAt(layer, x-1, y);
		if(_m_Controller->hasVia(x, y)) via = _m_Controller->getCellAt((layer == 0 ? 1 : 0), x, y);
		
		// Propagate input
		// To metal
		if(north && north->material == cell->material) north->high = true;
		if(east && east->material == cell->material) east->high = true;
		if(south && south->material == cell->material) south->high = true;
		if(west && west->material == cell->material) west->high = true;

		if(layer == 0)
		{
			// Determine if silicon is gated
			bool shouldActivate = false;
			if(via->material == 'p')
			{
				shouldActivate = true;
				for(unsigned int j=0; j<_m_activePNPGates.size(); ++j)
				{
					if(_m_activePNPGates[j] == via)
					{
						shouldActivate = false;
						break;
					}
				}
			}
			else if(via->material == 'n')
			{
				shouldActivate = false;
				for(unsigned int j=0; j<_m_activeNPNGates.size(); ++j)
				{
					if(_m_activeNPNGates[j] == via)
					{
						shouldActivate = true;
						break;
					}
				}
			}

			// To silicon
			if(shouldActivate)
			{
				if(via && via->material) via->high = true;
			}
		}
		else if(layer == 1)
		{
			// Metal vias from silicon always activate
			if(via && via->material) via->high = true;
		}
	}
}
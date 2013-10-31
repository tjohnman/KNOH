#include "Simulator.h"
#include "Controller.h"

Simulator::Simulator(Controller * c) : _m_Controller(c)
{
	m_Running = true;
	m_Delay = 50;
}

Simulator::~Simulator()
{

}

void Simulator::update(float delta)
{
	if(m_Running && _m_Clock.getElapsedTime().asMilliseconds() >= m_Delay)
	{
		_m_Clock.restart();

		sf::Vector2u gridSize = _m_Controller->getGridSize();

		// Schedule gates for firing
		_m_activePNPGates.clear();
		_m_activeNPNGates.clear();
		
		for(unsigned int i=0; i<gridSize.x*gridSize.y; ++i)
		{
			unsigned int x = i%gridSize.x;
			unsigned int y = i/gridSize.x;

			Controller::t_cell * cell = _m_Controller->getCellAt(1, x, y);
			if(cell && cell->material)
			{
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

				unsigned short sameCount = 0, otherCount = 0;
				if(north && north->material == cell->material && south && south->material == cell->material) sameCount += 2;
				if(east && east->material == cell->material && west && west->material == cell->material) sameCount += 2;

				if(north && north->material == gateMaterial) ++otherCount;
				if(east && east->material == gateMaterial) ++otherCount;
				if(south && south->material == gateMaterial) ++otherCount;
				if(west && west->material == gateMaterial) ++otherCount;

				bool isActive = (north && north->material == gateMaterial && north->high) ||
					(east && east->material == gateMaterial && east->high) ||
					(south && south->material == gateMaterial && south->high) ||
					(west && west->material == gateMaterial && west->high);

				if(!isActive) continue;

				// Schedule gate for propagation phase
				if(cell->material == 'p' && otherCount < sameCount) _m_activePNPGates.push_back(cell);
				else if(cell->material == 'n' && otherCount < sameCount) _m_activeNPNGates.push_back(cell);
			}
		}

		// Reset grid state
		for(unsigned int i=0; i<gridSize.x*gridSize.y; ++i)
		{
			Controller::t_cell * cell = _m_Controller->getCellAt(0, i%gridSize.x, i/gridSize.x);
			if(cell && cell->material)
			{
				cell->high = false;
			}

			cell = _m_Controller->getCellAt(1, i%gridSize.x, i/gridSize.x);
			if(cell && cell->material)
			{
				cell->high = false;
			}
		}

		// High pins
		for(unsigned int x=0; x<3; ++x)
		{
			for(unsigned int y=0; y<3; ++y)
			{
				_propagate(0, 1+x, 1+y);
				_propagate(0, gridSize.x - 4 +x, 1+y);
			}
		}
	}
}

void Simulator::_propagate(unsigned int layer, unsigned int x, unsigned int y)
{
	Controller::t_cell * cell;

	cell = _m_Controller->getCellAt(layer, x, y);
	if(cell && cell->material)
	{
		if(cell->high) return;

		Controller::t_cell * north = NULL, * east = NULL, * south = NULL, * west = NULL, * via = NULL;

		// Get neighbors
		if(cell->north) north = _m_Controller->getCellAt(layer, x, y-1);
		if(cell->east) east = _m_Controller->getCellAt(layer, x+1, y);
		if(cell->south) south = _m_Controller->getCellAt(layer, x, y+1);
		if(cell->west) west = _m_Controller->getCellAt(layer, x-1, y);
		if(_m_Controller->hasVia(x, y)) via = _m_Controller->getCellAt((layer == 0 ? 1 : 0), x, y);

		// If silicon layer
		if(layer == 1)
		{
			// Is this a gate?
			unsigned char gateMaterial = (cell->material == 'n' ? 'p' : 'n');

			unsigned short sameCount = 0, otherCount = 0;
			if(north && north->material == cell->material && south && south->material == cell->material) sameCount += 2;
			if(east && east->material == cell->material && west && west->material == cell->material) sameCount += 2;

			if(north && north->material == gateMaterial) ++otherCount;
			if(east && east->material == gateMaterial) ++otherCount;
			if(south && south->material == gateMaterial) ++otherCount;
			if(west && west->material == gateMaterial) ++otherCount;
			
			if(otherCount > 0 && otherCount < sameCount)
			{
				if(cell->material == 'p')
				{
					cell->high = true;
					for(unsigned int j=0; j<_m_activePNPGates.size(); ++j)
					{
						if(_m_activePNPGates[j] == cell)
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
						if(_m_activeNPNGates[j] == cell)
						{
							cell->high = true;
							break;
						}
					}
				}
			}
			else
				cell->high = true;
		}
		else // Otherwise (metal layer)
			cell->high = true;

		// If we are gated and did not activate, propagation ends here
		if(!cell->high) return;
		
		// Propagate to outputs
		if(north && north->material == cell->material) _propagate(layer, x, y-1);
		if(east && east->material == cell->material) _propagate(layer, x+1, y);
		if(south && south->material == cell->material) _propagate(layer, x, y+1);
		if(west && west->material == cell->material) _propagate(layer, x-1, y);
		if(via && via->material) _propagate((layer == 0 ? 1 : 0), x, y);
	}
}
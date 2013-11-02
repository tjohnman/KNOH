#ifndef SIMULATOR_H
#define SIMULATOR_H

#include "includes.h"
#include "Controller.h"

class Simulator
{
public:
	Simulator(Controller * c);
	~Simulator();

	void update(float delta);
	void reset();
	void toggleRunning();

	bool m_Running;
	int m_Delay;

private:
	sf::Clock _m_Clock;
	Controller * _m_Controller;

	std::vector<Controller::t_cell *> _m_activePNPGates;
	std::vector<Controller::t_cell *> _m_activeNPNGates;

	void _propagate(unsigned int layer, unsigned int x, unsigned int y);
};

#endif
#include "includes.h"

#include "Controller.h"

// TODO: Move to configuration manager
#define W_WIDTH 1440
#define W_HEIGHT 900

int main()
{
	sf::RenderWindow window(sf::VideoMode(W_WIDTH, W_HEIGHT), "KNOH", sf::Style::Close);
	window.setFramerateLimit(0);
	window.setVerticalSyncEnabled(true);

	sf::Clock clock;
	clock.restart();

	Controller controller(window.getSize().x, window.getSize().y);
	controller.init();

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
			switch(event.type)
			{
			case sf::Event::Closed:
				{
					window.close();
					break;
				}
			case sf::Event::KeyPressed:
				{
					controller.onKeyPressed(event.key);
					break;
				}
			case sf::Event::KeyReleased:
				{
					controller.onKeyReleased(event.key);
					break;
				}
			case sf::Event::MouseButtonPressed:
				{
					controller.onMouseDown(event.mouseButton);
					break;
				}
			case sf::Event::MouseButtonReleased:
				{
					controller.onMouseUp(event.mouseButton);
					break;
				}
			}
        }

		controller.m_MousePosition = sf::Mouse::getPosition(window);
		controller.update(clock.getElapsedTime().asSeconds());
		clock.restart();

        window.clear();

		controller.draw(&window);

        window.display();
    }

    return 0;
}